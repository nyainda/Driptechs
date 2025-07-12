import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { eq, and, desc, asc } from 'drizzle-orm';
import * as schema from './shared/schema.js';

const { 
  users, products, quotes, projects, blogPosts, contacts, 
  teamMembers, successStories, pageViews, websiteAnalytics,
  achievements, userAchievements, gamificationStats
} = schema;

// Initialize database with Supabase support
const getDatabaseConfig = () => {
  const dbUrl = process.env.DATABASE_URL;
  
  if (dbUrl.includes('supabase.co')) {
    console.log('🔗 Using Supabase PostgreSQL');
    return { provider: 'supabase', url: dbUrl };
  } else if (dbUrl.includes('neon.tech')) {
    console.log('🔗 Using Neon PostgreSQL');
    return { provider: 'neon', url: dbUrl };
  } else {
    console.log('🔗 Using Generic PostgreSQL');
    return { provider: 'generic', url: dbUrl };
  }
};

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// JWT Secret - auto-generate if not provided
const generateJWTSecret = () => {
  const crypto = require('crypto');
  return crypto.randomBytes(64).toString('hex');
};

const JWT_SECRET = process.env.JWT_SECRET || generateJWTSecret();

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Storage class for database operations
class Storage {
  async getUsers() {
    try {
      return await db.select().from(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  async getUserByEmail(email) {
    try {
      const result = await db.select().from(users).where(eq(users.email, email));
      return result[0] || null;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
  }

  async createUser(userData) {
    try {
      const id = nanoid();
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const newUser = {
        id,
        ...userData,
        password: hashedPassword,
        createdAt: new Date()
      };

      await db.insert(users).values(newUser);
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getProducts() {
    try {
      return await db.select().from(products).orderBy(asc(products.name));
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  async getProduct(id) {
    try {
      const result = await db.select().from(products).where(eq(products.id, id));
      return result[0] || null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  }

  async createProduct(productData) {
    try {
      const id = nanoid();
      const newProduct = {
        id,
        ...productData,
        createdAt: new Date()
      };

      await db.insert(products).values(newProduct);
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(id, updateData) {
    try {
      await db.update(products).set(updateData).where(eq(products.id, id));
      return await this.getProduct(id);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      await db.delete(products).where(eq(products.id, id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  async getQuotes() {
    try {
      return await db.select().from(quotes).orderBy(desc(quotes.createdAt));
    } catch (error) {
      console.error('Error fetching quotes:', error);
      return [];
    }
  }

  async getQuote(id) {
    try {
      const result = await db.select().from(quotes).where(eq(quotes.id, id));
      return result[0] || null;
    } catch (error) {
      console.error('Error fetching quote:', error);
      return null;
    }
  }

  async createQuote(quoteData) {
    try {
      const id = nanoid();
      const newQuote = {
        id,
        ...quoteData,
        status: 'pending',
        createdAt: new Date()
      };

      await db.insert(quotes).values(newQuote);
      return newQuote;
    } catch (error) {
      console.error('Error creating quote:', error);
      throw error;
    }
  }

  async updateQuote(id, updateData) {
    try {
      await db.update(quotes).set(updateData).where(eq(quotes.id, id));
      return await this.getQuote(id);
    } catch (error) {
      console.error('Error updating quote:', error);
      throw error;
    }
  }

  async deleteQuote(id) {
    try {
      await db.delete(quotes).where(eq(quotes.id, id));
    } catch (error) {
      console.error('Error deleting quote:', error);
      throw error;
    }
  }

  async getProjects() {
    try {
      return await db.select().from(projects).orderBy(desc(projects.createdAt));
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  }

  async createProject(projectData) {
    try {
      const id = nanoid();
      const newProject = {
        id,
        ...projectData,
        createdAt: new Date()
      };

      await db.insert(projects).values(newProject);
      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }

  async getBlogPosts() {
    try {
      return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
  }

  async getBlogPostBySlug(slug) {
    try {
      const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
      return result[0] || null;
    } catch (error) {
      console.error('Error fetching blog post by slug:', error);
      return null;
    }
  }

  async createBlogPost(postData) {
    try {
      const id = nanoid();
      const newPost = {
        id,
        ...postData,
        createdAt: new Date()
      };

      await db.insert(blogPosts).values(newPost);
      return newPost;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  }

  async updateBlogPost(id, updateData) {
    try {
      await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, id));
      const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
      return result[0] || null;
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  }

  async deleteBlogPost(id) {
    try {
      await db.delete(blogPosts).where(eq(blogPosts.id, id));
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  }

  async getContacts() {
    try {
      return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return [];
    }
  }

  async createContact(contactData) {
    try {
      const id = nanoid();
      const newContact = {
        id,
        ...contactData,
        createdAt: new Date()
      };

      await db.insert(contacts).values(newContact);
      return newContact;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  }

  async getTeamMembers() {
    try {
      return await db.select().from(teamMembers).orderBy(asc(teamMembers.name));
    } catch (error) {
      console.error('Error fetching team members:', error);
      return [];
    }
  }

  async createTeamMember(data) {
    try {
      const id = nanoid();
      const newMember = {
        id,
        ...data,
        createdAt: new Date()
      };

      await db.insert(teamMembers).values(newMember);
      return newMember;
    } catch (error) {
      console.error('Error creating team member:', error);
      throw error;
    }
  }

  async updateTeamMember(id, data) {
    try {
      await db.update(teamMembers).set(data).where(eq(teamMembers.id, id));
      const result = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
      return result[0] || null;
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  }

  async deleteTeamMember(id) {
    try {
      await db.delete(teamMembers).where(eq(teamMembers.id, id));
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw error;
    }
  }

  async getSuccessStories() {
    try {
      return await db.select().from(successStories).orderBy(desc(successStories.createdAt));
    } catch (error) {
      console.error('Error fetching success stories:', error);
      return [];
    }
  }

  async createSuccessStory(data) {
    try {
      const id = nanoid();
      const newStory = {
        id,
        ...data,
        createdAt: new Date()
      };

      await db.insert(successStories).values(newStory);
      return newStory;
    } catch (error) {
      console.error('Error creating success story:', error);
      throw error;
    }
  }

  async updateSuccessStory(id, data) {
    try {
      await db.update(successStories).set(data).where(eq(successStories.id, id));
      const result = await db.select().from(successStories).where(eq(successStories.id, id));
      return result[0] || null;
    } catch (error) {
      console.error('Error updating success story:', error);
      throw error;
    }
  }

  async deleteSuccessStory(id) {
    try {
      await db.delete(successStories).where(eq(successStories.id, id));
    } catch (error) {
      console.error('Error deleting success story:', error);
      throw error;
    }
  }

  async trackPageView(data) {
    try {
      const id = nanoid();
      const pageViewData = {
        id,
        ...data,
        createdAt: new Date()
      };

      await db.insert(pageViews).values(pageViewData);
      return pageViewData;
    } catch (error) {
      console.error('Error tracking page view:', error);
      throw error;
    }
  }

  async getTodayUniqueVisitors() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const result = await db.select().from(pageViews);
      const todayViews = result.filter(view => 
        new Date(view.createdAt) >= today
      );
      
      const uniqueSessionIds = new Set(todayViews.map(view => view.sessionId));
      return uniqueSessionIds.size;
    } catch (error) {
      console.error('Error getting today unique visitors:', error);
      return 0;
    }
  }

  async getVisitorGrowth() {
    try {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const result = await db.select().from(pageViews);
      
      const todayViews = result.filter(view => {
        const viewDate = new Date(view.createdAt);
        return viewDate >= today;
      });
      
      const yesterdayViews = result.filter(view => {
        const viewDate = new Date(view.createdAt);
        return viewDate >= yesterday && viewDate < today;
      });
      
      const todayUnique = new Set(todayViews.map(view => view.sessionId)).size;
      const yesterdayUnique = new Set(yesterdayViews.map(view => view.sessionId)).size;
      
      if (yesterdayUnique === 0) return 0;
      return Math.round(((todayUnique - yesterdayUnique) / yesterdayUnique) * 100);
    } catch (error) {
      console.error('Error getting visitor growth:', error);
      return 0;
    }
  }

  async initializeAdminUser() {
    try {
      const existingAdmin = await this.getUserByEmail('admin@driptech.co.ke');
      if (existingAdmin) {
        console.log('👤 Admin user already exists');
        return;
      }

      await this.createUser({
        name: 'Admin User',
        email: 'admin@driptech.co.ke',
        password: 'admin123',
        role: 'admin'
      });

      console.log('👤 Admin user created successfully');
    } catch (error) {
      console.error('Error initializing admin user:', error);
    }
  }
}

const storage = new Storage();

// Database initialization
async function ensureInitialized() {
  try {
    await storage.initializeAdminUser();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}

// Routes
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

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Public routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await storage.getProducts();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
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
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/projects', async (req, res) => {
  try {
    const projects = await storage.getProjects();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/blog', async (req, res) => {
  try {
    const posts = await storage.getBlogPosts();
    res.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Internal server error' });
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
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/team', async (req, res) => {
  try {
    const team = await storage.getTeamMembers();
    res.json(team);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/success-stories', async (req, res) => {
  try {
    const stories = await storage.getSuccessStories();
    res.json(stories);
  } catch (error) {
    console.error('Error fetching success stories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const contact = await storage.createContact(req.body);
    res.status(201).json(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/quotes', async (req, res) => {
  try {
    const quote = await storage.createQuote(req.body);
    res.status(201).json(quote);
  } catch (error) {
    console.error('Error creating quote:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/track/pageview', async (req, res) => {
  try {
    await storage.trackPageView(req.body);
    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking page view:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected admin routes
app.get('/api/admin/quotes', authenticateToken, async (req, res) => {
  try {
    const quotes = await storage.getQuotes();
    res.json(quotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/admin/contacts', authenticateToken, async (req, res) => {
  try {
    const contacts = await storage.getContacts();
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/admin/analytics', authenticateToken, async (req, res) => {
  try {
    const todayVisitors = await storage.getTodayUniqueVisitors();
    const visitorGrowth = await storage.getVisitorGrowth();
    
    res.json({
      todayVisitors,
      visitorGrowth,
      totalProducts: (await storage.getProducts()).length,
      totalProjects: (await storage.getProjects()).length,
      totalQuotes: (await storage.getQuotes()).length,
      totalContacts: (await storage.getContacts()).length
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin CRUD operations
app.post('/api/admin/products', authenticateToken, async (req, res) => {
  try {
    const product = await storage.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/admin/products/:id', authenticateToken, async (req, res) => {
  try {
    const product = await storage.updateProduct(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/admin/products/:id', authenticateToken, async (req, res) => {
  try {
    await storage.deleteProduct(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/admin/quotes/:id', authenticateToken, async (req, res) => {
  try {
    const quote = await storage.updateQuote(req.params.id, req.body);
    res.json(quote);
  } catch (error) {
    console.error('Error updating quote:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/admin/quotes/:id', authenticateToken, async (req, res) => {
  try {
    await storage.deleteQuote(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting quote:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/admin/blog', authenticateToken, async (req, res) => {
  try {
    const post = await storage.createBlogPost(req.body);
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/admin/blog/:id', authenticateToken, async (req, res) => {
  try {
    const post = await storage.updateBlogPost(req.params.id, req.body);
    res.json(post);
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/admin/blog/:id', authenticateToken, async (req, res) => {
  try {
    await storage.deleteBlogPost(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/admin/team', authenticateToken, async (req, res) => {
  try {
    const member = await storage.createTeamMember(req.body);
    res.status(201).json(member);
  } catch (error) {
    console.error('Error creating team member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/admin/team/:id', authenticateToken, async (req, res) => {
  try {
    const member = await storage.updateTeamMember(req.params.id, req.body);
    res.json(member);
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/admin/team/:id', authenticateToken, async (req, res) => {
  try {
    await storage.deleteTeamMember(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/admin/success-stories', authenticateToken, async (req, res) => {
  try {
    const story = await storage.createSuccessStory(req.body);
    res.status(201).json(story);
  } catch (error) {
    console.error('Error creating success story:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/admin/success-stories/:id', authenticateToken, async (req, res) => {
  try {
    const story = await storage.updateSuccessStory(req.params.id, req.body);
    res.json(story);
  } catch (error) {
    console.error('Error updating success story:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/admin/success-stories/:id', authenticateToken, async (req, res) => {
  try {
    await storage.deleteSuccessStory(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting success story:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Basic HTML response for root access
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>DripTech Irrigation Solutions</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
          .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          h1 { color: #22c55e; text-align: center; }
          .api-list { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .api-item { margin: 10px 0; padding: 10px; background: white; border-radius: 3px; }
          .method { color: #22c55e; font-weight: bold; margin-right: 10px; }
          .admin-link { display: inline-block; background: #22c55e; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .admin-link:hover { background: #16a34a; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🌱 DripTech Irrigation Solutions</h1>
          <p>Welcome to DripTech API - Your comprehensive irrigation management system.</p>
          
          <h2>Available API Endpoints</h2>
          <div class="api-list">
            <div class="api-item"><span class="method">GET</span> /api/products - View all products</div>
            <div class="api-item"><span class="method">GET</span> /api/projects - View all projects</div>
            <div class="api-item"><span class="method">GET</span> /api/blog - View blog posts</div>
            <div class="api-item"><span class="method">GET</span> /api/team - View team members</div>
            <div class="api-item"><span class="method">GET</span> /api/success-stories - View success stories</div>
            <div class="api-item"><span class="method">POST</span> /api/contacts - Submit contact form</div>
            <div class="api-item"><span class="method">POST</span> /api/quotes - Request quote</div>
            <div class="api-item"><span class="method">POST</span> /api/login - Admin login</div>
          </div>
          
          <h2>Admin Dashboard</h2>
          <p>Access the admin dashboard to manage your irrigation business:</p>
          <a href="/admin" class="admin-link">Go to Admin Dashboard</a>
          
          <h2>Credentials</h2>
          <p><strong>Email:</strong> admin@driptech.co.ke<br>
          <strong>Password:</strong> admin123</p>
          
          <h2>Features</h2>
          <ul>
            <li>Product catalog management</li>
            <li>Quote generation and tracking</li>
            <li>Project portfolio showcase</li>
            <li>Customer contact management</li>
            <li>Blog content management</li>
            <li>Team member profiles</li>
            <li>Success story tracking</li>
            <li>Real-time analytics</li>
          </ul>
        </div>
      </body>
    </html>
  `);
});

// Vercel serverless function handler
export default async function handler(req, res) {
  await ensureInitialized();
  return app(req, res);
}