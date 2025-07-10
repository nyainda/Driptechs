import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./server/routes.js"; // Keep .js for ES modules
import { initializeDatabase } from './server/init-db.js'; // Keep .js for ES modules
import { checkDatabaseConnection, getDatabaseConfig } from './server/db.js'; // Keep .js for ES modules

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "...";
      }

      console.log(logLine);
    }
  });

  next();
});

// Database initialization status
let isInitialized = false;
let initError: Error | null = null;

// Initialize database
const initializeApp = async () => {
  try {
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      throw new Error('Database connection failed. Please check your DATABASE_URL.');
    }

    const dbConfig = getDatabaseConfig();
    console.log(`🗄️  Database provider: ${dbConfig.provider}`);

    await initializeDatabase();
    isInitialized = true;
    console.log('✅ Database initialized successfully');
  } catch (error) {
    initError = error as Error;
    console.error('❌ Database initialization failed:', error);
  }
};

// Middleware to check initialization status
app.use('/api', (req, res, next) => {
  if (!isInitialized && initError) {
    return res.status(500).json({ 
      error: 'Database initialization failed',
      message: initError.message 
    });
  }
  
  if (!isInitialized) {
    return res.status(503).json({ 
      error: 'Service temporarily unavailable',
      message: 'Database is still initializing...' 
    });
  }
  
  next();
});

// Health check route (bypasses initialization check)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: isInitialized ? 'ok' : initError ? 'error' : 'initializing',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Initialize and register routes once
let appSetup = false;

const setupApp = async () => {
  if (!appSetup) {
    await initializeApp();
    await registerRoutes(app);
    
    // Error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });
    
    appSetup = true;
  }
  
  return app;
};

// Vercel serverless function handler
export default async function handler(req: any, res: any) {
  const appInstance = await setupApp();
  return appInstance(req, res);
}