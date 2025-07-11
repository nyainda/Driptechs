import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./server/routes";
import { initializeDatabase } from './server/init-db';
import { checkDatabaseConnection, getDatabaseConfig } from './server/db';

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
    if (path.startsWith("/api") || path.startsWith("/admin")) {
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
    console.log('🔄 Initializing database...');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

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
    // Don't throw here - let the app continue with error state
  }
};

// Middleware to check initialization status for API routes
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
let appSetupPromise: Promise<typeof app> | null = null;

const setupApp = async () => {
  if (appSetupPromise) {
    return appSetupPromise;
  }

  if (!appSetup) {
    appSetupPromise = (async () => {
      try {
        await initializeApp();
        await registerRoutes(app);

        // Error handler
        app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
          console.error('❌ Express error:', err);
          const status = err.status || err.statusCode || 500;
          const message = err.message || "Internal Server Error";
          res.status(status).json({ message, error: err.name });
        });

        appSetup = true;
        console.log('✅ App setup complete');
        return app;
      } catch (error) {
        console.error('❌ App setup failed:', error);
        appSetupPromise = null; // Reset so we can try again
        throw error;
      }
    })();
  }

  return appSetupPromise || app;
};

// Vercel serverless function handler
export default async function handler(req: any, res: any) {
  try {
    const appInstance = await setupApp();
    return appInstance(req, res);
  } catch (error) {
    console.error('❌ Handler error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}