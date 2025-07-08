
#!/usr/bin/env node

// Build script for Vercel deployment
import { build } from 'vite';
import fs from 'fs';
import path from 'path';

async function buildForVercel() {
  console.log('🏗️  Building for Vercel deployment...');
  
  try {
    // Build frontend with Vite
    console.log('📦 Building frontend...');
    await build({
      root: './client',
      build: {
        outDir: '../dist/public',
        emptyOutDir: true,
        rollupOptions: {
          input: './client/index.html'
        }
      }
    });
    
    // Ensure the API directory structure exists
    const apiDir = path.join(process.cwd(), 'api');
    if (!fs.existsSync(apiDir)) {
      fs.mkdirSync(apiDir, { recursive: true });
    }
    
    console.log('✅ Build completed successfully!');
    console.log('📁 Frontend built to: dist/public');
    console.log('📁 Backend entry point: server/index.ts');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildForVercel();
