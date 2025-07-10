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

const setupApp = async () => {
  if (!appSetup) {
    await initializeApp();
    await registerRoutes(app);

    // Admin route - Add this to handle /admin requests
    app.get('/admin', (req, res) => {
      // Basic admin page HTML
      const adminHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Admin Panel</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
            .status { padding: 10px; border-radius: 5px; margin: 10px 0; }
            .status.ok { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
            .status.error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
            .nav { margin: 20px 0; }
            .nav a { display: inline-block; padding: 10px 20px; margin: 5px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
            .nav a:hover { background: #0056b3; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Admin Panel</h1>
            <div class="status ${isInitialized ? 'ok' : 'error'}">
              Database Status: ${isInitialized ? '✅ Connected' : '❌ Not Connected'}
              ${initError ? `<br>Error: ${initError.message}` : ''}
            </div>
            <div class="nav">
              <a href="/api/health">Health Check</a>
              <a href="/admin/users">Manage Users</a>
              <a href="/admin/settings">Settings</a>
            </div>
            <p>Welcome to the admin panel. Use the navigation above to manage your application.</p>
          </div>
        </body>
        </html>
      `;
      res.send(adminHTML);
    });

    // Admin API routes
    app.get('/admin/users', (req, res) => {
      if (!isInitialized) {
        return res.status(503).json({
          error: 'Service temporarily unavailable',
          message: 'Database is still initializing...'
        });
      }
      res.json({ message: 'Users management endpoint', users: [] });
    });

    app.get('/admin/settings', (req, res) => {
      if (!isInitialized) {
        return res.status(503).json({
          error: 'Service temporarily unavailable',
          message: 'Database is still initializing...'
        });
      }
      res.json({ message: 'Settings management endpoint', settings: {} });
    });

    // Debug route logging
    console.log('🔍 Registered routes:');
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        console.log(`   ${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
      }
    });

    // Catch unhandled routes for debugging
    app.use('*', (req, res, next) => {
      console.log(`❓ Unhandled route: ${req.method} ${req.path}`);
      if (req.path.startsWith('/admin') || req.path.startsWith('/api')) {
        return res.status(404).json({ 
          error: 'Not Found',
          message: `Route ${req.method} ${req.path} not found`,
          availableRoutes: ['/admin', '/admin/users', '/admin/settings', '/api/health']
        });
      }
      next();
    });

    // Error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error('❌ Express error:', err);
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message, error: err.name });
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