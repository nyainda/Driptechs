import express from "express";
import cors from "cors";
import { storage } from "./server/storage.js";
import { initializeDatabase } from "./server/init-db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendQuoteEmail } from "./server/email.js";

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://driptech-irrigation.vercel.app', /\.vercel\.app$/]
    : ['http://localhost:3000', 'http://localhost:5000', 'http://127.0.0.1:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await storage.getUser(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Auth routes
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Page tracking
app.post('/api/track/pageview', async (req, res) => {
  try {
    const { page } = req.body;
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.ip || req.connection.remoteAddress || '';
    const sessionId = req.headers['x-session-id'] || 'anonymous';

    await storage.trackPageView({ page, userAgent, ipAddress, sessionId });
    res.json({ success: true });
  } catch (error) {
    console.error('Page tracking error:', error);
    res.status(500).json({ error: 'Failed to track page view' });
  }
});

// Products routes
app.get('/api/products', async (req, res) => {
  try {
    const { category } = req.query;
    let products;
    
    if (category) {
      products = await storage.getProductsByCategory(category);
    } else {
      products = await storage.getProducts();
    }
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await storage.getProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.post('/api/products', authenticate, async (req, res) => {
  try {
    const product = await storage.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', authenticate, async (req, res) => {
  try {
    const product = await storage.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', authenticate, async (req, res) => {
  try {
    await storage.deleteProduct(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Quotes routes
app.get('/api/quotes', authenticate, async (req, res) => {
  try {
    const quotes = await storage.getQuotes();
    res.json(quotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

app.post('/api/quotes', async (req, res) => {
  try {
    const quote = await storage.createQuote(req.body);
    res.status(201).json(quote);
  } catch (error) {
    console.error('Error creating quote:', error);
    res.status(500).json({ error: 'Failed to create quote' });
  }
});

app.put('/api/quotes/:id', authenticate, async (req, res) => {
  try {
    const quote = await storage.updateQuote(req.params.id, req.body);
    res.json(quote);
  } catch (error) {
    console.error('Error updating quote:', error);
    res.status(500).json({ error: 'Failed to update quote' });
  }
});

app.post('/api/quotes/:id/send', authenticate, async (req, res) => {
  try {
    const quote = await storage.getQuote(req.params.id);
    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }

    await sendQuoteEmail(quote);
    await storage.updateQuote(req.params.id, { 
      status: 'sent', 
      sentAt: new Date().toISOString() 
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending quote:', error);
    res.status(500).json({ error: 'Failed to send quote' });
  }
});

// Projects routes
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await storage.getProjects();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.post('/api/projects', authenticate, async (req, res) => {
  try {
    const project = await storage.createProject(req.body);
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Blog routes
app.get('/api/blog', async (req, res) => {
  try {
    const posts = await storage.getBlogPosts();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

app.get('/api/blog/:slug', async (req, res) => {
  try {
    const post = await storage.getBlogPostBySlug(req.params.slug);
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

app.post('/api/blog', authenticate, async (req, res) => {
  try {
    const post = await storage.createBlogPost(req.body);
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

// Contacts routes
app.get('/api/contacts', authenticate, async (req, res) => {
  try {
    const contacts = await storage.getContacts();
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const contact = await storage.createContact(req.body);
    res.status(201).json(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

// Team routes
app.get('/api/team', async (req, res) => {
  try {
    const team = await storage.getTeamMembers();
    res.json(team);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

app.post('/api/team', authenticate, async (req, res) => {
  try {
    const member = await storage.createTeamMember(req.body);
    res.status(201).json(member);
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({ error: 'Failed to create team member' });
  }
});

// Success stories routes
app.get('/api/success-stories', async (req, res) => {
  try {
    const stories = await storage.getSuccessStories();
    res.json(stories);
  } catch (error) {
    console.error('Error fetching success stories:', error);
    res.status(500).json({ error: 'Failed to fetch success stories' });
  }
});

app.post('/api/success-stories', authenticate, async (req, res) => {
  try {
    const story = await storage.createSuccessStory(req.body);
    res.status(201).json(story);
  } catch (error) {
    console.error('Error creating success story:', error);
    res.status(500).json({ error: 'Failed to create success story' });
  }
});

// Analytics routes
app.get('/api/analytics', authenticate, async (req, res) => {
  try {
    const analytics = await storage.getAnalytics();
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Placeholder image route
app.get('/api/placeholder/:width/:height', (req, res) => {
  const { width, height } = req.params;
  const svg = \`<svg width="\${width}" height="\${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#f0f0f0"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#999" text-anchor="middle" dy=".3em">\${width}x\${height}</text>
  </svg>\`;
  
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize database on first run
let isInitialized = false;

async function ensureInitialized() {
  if (!isInitialized) {
    try {
      await initializeDatabase();
      isInitialized = true;
    } catch (error) {
      console.error('Database initialization failed:', error);
    }
  }
}

// For Vercel serverless function
export default async function handler(req, res) {
  await ensureInitialized();
  return app(req, res);
}