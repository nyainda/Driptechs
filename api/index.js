import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import your main server module
import { registerRoutes } from '../server/routes.js';
import { checkDatabaseConnection } from '../server/db.js';

// Load environment variables
dotenv.config();

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

// Initialize database and routes
async function initializeApp() {
  try {
    console.log('🔄 Initializing Vercel serverless function...');
    
    // Check database connection
    await checkDatabaseConnection();
    console.log('✅ Database connection verified');
    
    // Register API routes
    await registerRoutes(app);
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