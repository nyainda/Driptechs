
// Vercel serverless function entry point
const path = require('path');

// Import the compiled server - try different approaches for compatibility
let app;
try {
  // Try to import the compiled server
  const serverModule = require('../dist/index.js');
  app = serverModule.default || serverModule;
} catch (error) {
  console.error('Failed to import compiled server:', error);
  
  // Fallback: try to run the TypeScript directly (not recommended for production)
  try {
    require('tsx/cjs');
    const serverModule = require('../server/index.ts');
    app = serverModule.default || serverModule;
  } catch (tsError) {
    console.error('Failed to import TypeScript server:', tsError);
    throw new Error('Could not load server application');
  }
}

// Ensure we export a function for Vercel
module.exports = app;

// Also export as default for compatibility
module.exports.default = app;
