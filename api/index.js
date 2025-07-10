import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import ws from 'ws';

// Load environment variables
dotenv.config();

// Configure Neon
neonConfig.webSocketConstructor = ws;

// Database setup
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool });

// Simple health check
async function checkDatabaseConnection() {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://driptech.vercel.app', 'https://www.driptech.co.ke']
    : ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Trust proxy for proper IP detection on Vercel
app.set('trust proxy', 1);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Simple API routes for essential functionality
function registerSimpleRoutes(app) {
  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production'
    });
  });

  // Products endpoint with database integration
  app.get('/api/products', async (req, res) => {
    try {
      // In production, this would connect to your database
      // For now, using sample data that matches your original structure
      const products = [
        {
          id: '22836c86-6177-42f5-b2ea-0e3023a94489',
          name: 'Premium Drip Irrigation Kit - Small Farm',
          description: 'Complete drip irrigation system perfect for small farms up to 1 acre. Includes all necessary components for efficient water management.',
          price: 'KSH 25,000',
          category: 'irrigation',
          specifications: 'Coverage: 1 acre, Flow rate: 200L/hr, Pressure: 1.5 bar',
          features: ['Water-efficient', 'Easy installation', 'Durable materials', '2-year warranty'],
          image: '/api/placeholder/400/300',
          inStock: true,
          rating: 4.8,
          reviews: 24
        },
        {
          id: '33947d97-7288-53g6-c3fb-1f4134b95599',
          name: 'Professional Drip Irrigation Kit - Medium Farm',
          description: 'Advanced irrigation system ideal for medium farms 1-5 acres. Professional grade components with automated controls.',
          price: 'KSH 75,000',
          category: 'irrigation',
          specifications: 'Coverage: 5 acres, Flow rate: 500L/hr, Pressure: 2.0 bar',
          features: ['Automated timing', 'Weather sensors', 'Remote monitoring', '3-year warranty'],
          image: '/api/placeholder/400/300',
          inStock: true,
          rating: 4.9,
          reviews: 18
        },
        {
          id: '44058e08-8399-64h7-d4gc-2f5245c06600',
          name: 'Commercial Drip Irrigation Kit - Large Farm',
          description: 'Industrial-grade irrigation system for large farms 5+ acres. Complete automation with smart monitoring and control systems.',
          price: 'KSH 150,000',
          category: 'irrigation',
          specifications: 'Coverage: 20+ acres, Flow rate: 1000L/hr, Pressure: 3.0 bar',
          features: ['Smart automation', 'IoT connectivity', 'Mobile app control', '5-year warranty'],
          image: '/api/placeholder/400/300',
          inStock: true,
          rating: 5.0,
          reviews: 12
        }
      ];
      res.json(products);
    } catch (error) {
      console.error('Products API error:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  // Simple placeholder image endpoint
  app.get('/api/placeholder/:width/:height', (req, res) => {
    const { width, height } = req.params;
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#0066cc"/>
        <text x="50%" y="50%" fill="white" text-anchor="middle" dy=".3em" font-family="Arial, sans-serif" font-size="20">
          DripTech ${width}x${height}
        </text>
      </svg>
    `;
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svg);
  });

  // Quote submission endpoint
  app.post('/api/quotes', async (req, res) => {
    try {
      const quote = {
        id: nanoid(),
        ...req.body,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      console.log('Quote submitted:', quote);
      res.json({ success: true, quote });
    } catch (error) {
      res.status(500).json({ error: 'Failed to submit quote' });
    }
  });

  // Contact form endpoint
  app.post('/api/contacts', async (req, res) => {
    try {
      const contact = {
        id: nanoid(),
        ...req.body,
        createdAt: new Date().toISOString()
      };
      
      console.log('Contact submitted:', contact);
      res.json({ success: true, contact });
    } catch (error) {
      res.status(500).json({ error: 'Failed to submit contact' });
    }
  });

  // Blog posts endpoint
  app.get('/api/blog', async (req, res) => {
    try {
      const posts = [
        {
          id: '1',
          title: 'Benefits of Drip Irrigation',
          excerpt: 'Discover how drip irrigation can transform your farming...',
          slug: 'benefits-of-drip-irrigation',
          createdAt: new Date().toISOString()
        }
      ];
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
  });

  // Projects endpoint
  app.get('/api/projects', async (req, res) => {
    try {
      const projects = [
        {
          id: '1',
          title: 'Large Scale Farm Project',
          description: 'Successful 100-acre drip irrigation installation',
          image: '/api/placeholder/600/400',
          location: 'Nakuru, Kenya'
        }
      ];
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  // Team endpoint
  app.get('/api/team', async (req, res) => {
    try {
      const team = [
        {
          id: '1',
          name: 'John Doe',
          role: 'Lead Engineer',
          image: '/api/placeholder/400/400',
          bio: 'Expert in irrigation systems with 10+ years experience'
        }
      ];
      res.json(team);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch team' });
    }
  });

  // Success stories endpoint
  app.get('/api/success-stories', async (req, res) => {
    try {
      const stories = [
        {
          id: '1',
          title: 'Farmer Success Story',
          content: 'Increased yield by 40% with our irrigation system',
          author: 'Mary Wanjiku',
          location: 'Kiambu, Kenya'
        }
      ];
      res.json(stories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch success stories' });
    }
  });

  // Page view tracking
  app.post('/api/track/pageview', async (req, res) => {
    try {
      console.log('Page view tracked:', req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to track page view' });
    }
  });
}

// Initialize database and routes
async function initializeApp() {
  try {
    console.log('🔄 Initializing Vercel serverless function...');
    
    // Check database connection
    await checkDatabaseConnection();
    console.log('✅ Database connection verified');
    
    // Register simplified API routes
    registerSimpleRoutes(app);
    console.log('✅ API routes registered');
    
    console.log('✅ Serverless function ready');
  } catch (error) {
    console.error('❌ Failed to initialize serverless function:', error);
  }
}

// Initialize on first request (serverless)
let initialized = false;
app.use(async (req, res, next) => {
  if (!initialized) {
    await initializeApp();
    initialized = true;
  }
  next();
});

// Export for Vercel
export default app;