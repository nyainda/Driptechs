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

  // Simple products endpoint
  app.get('/api/products', async (req, res) => {
    try {
      const products = [
        {
          id: '1',
          name: 'Drip Irrigation Kit - Small Farm',
          description: 'Perfect for small farms up to 1 acre',
          price: 'KSH 25,000',
          category: 'irrigation',
          image: '/api/placeholder/400/300'
        },
        {
          id: '2',
          name: 'Drip Irrigation Kit - Medium Farm',
          description: 'Ideal for medium farms 1-5 acres',
          price: 'KSH 75,000',
          category: 'irrigation',
          image: '/api/placeholder/400/300'
        },
        {
          id: '3',
          name: 'Drip Irrigation Kit - Large Farm',
          description: 'Commercial grade for large farms 5+ acres',
          price: 'KSH 150,000',
          category: 'irrigation',
          image: '/api/placeholder/400/300'
        }
      ];
      res.json(products);
    } catch (error) {
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