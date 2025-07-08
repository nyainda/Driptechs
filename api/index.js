// Vercel serverless function entry point
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the compiled server - try different approaches for compatibility
let app;
try {
  // Try to import the compiled server
  const serverModule = await import('../dist/index.js');
  app = serverModule.default || serverModule;
} catch (error) {
  console.error('Failed to import compiled server:', error);
  
  // Fallback: try to run the TypeScript directly (not recommended for production)
  try {
    // Note: tsx might not work in ES modules, consider using ts-node/esm
    const serverModule = await import('../server/index.ts');
    app = serverModule.default || serverModule;
  } catch (tsError) {
    console.error('Failed to import TypeScript server:', tsError);
    throw new Error('Could not load server application');
  }
}

// Export as default for Vercel
export default app;