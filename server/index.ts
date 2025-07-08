import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeDatabase } from './init-db';
import { checkDatabaseConnection, getDatabaseConfig } from './db';

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
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
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
    
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
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

// Main application setup
const setupApp = async () => {
  // Initialize database first
  await initializeApp();
  
  // Register routes
  const server = await registerRoutes(app);

  // Error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    
    // Only throw in development
    if (process.env.NODE_ENV !== 'production') {
      throw err;
    }
  });

  // Setup static serving
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Start server only in development
  if (process.env.NODE_ENV !== 'production') {
    const port = 5000;
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`serving on port ${port}`);
    });
  }

  return app;
};

// Initialize app (don't await in module scope for Vercel)
setupApp().catch(console.error);

export default app;