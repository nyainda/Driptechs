// Vercel serverless function entry point
let app;

try {
  // Import the esbuild-compiled server from dist/index.js
  const serverModule = await import('../dist/index.js');
  app = serverModule.default || serverModule;
  console.log('Successfully loaded server from dist/index.js');
} catch (error) {
  console.error('Failed to import server:', error);
  
  // Create a simple fallback handler
  app = (req, res) => {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    res.status(500).json({ 
      error: 'Server application failed to load',
      message: error.message || 'Please check build configuration',
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.url
    });
  };
}

export default app;