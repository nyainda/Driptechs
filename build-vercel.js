
#!/usr/bin/env node

// Build script for Vercel deployment
import { build } from 'vite';
import { build as esbuild } from 'esbuild';
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
    
    // Build backend with esbuild for Node.js
    console.log('🔧 Building backend...');
    await esbuild({
      entryPoints: ['server/index.ts'],
      bundle: true,
      platform: 'node',
      target: 'node18',
      format: 'cjs',
      outfile: 'dist/index.js',
      external: ['better-sqlite3', 'pg-native'],
      banner: {
        js: '// Compiled by esbuild for Vercel deployment'
      }
    });
    
    // Ensure the API directory structure exists
    const apiDir = path.join(process.cwd(), 'api');
    if (!fs.existsSync(apiDir)) {
      fs.mkdirSync(apiDir, { recursive: true });
    }
    
    console.log('✅ Build completed successfully!');
    console.log('📁 Frontend built to: dist/public');
    console.log('📁 Backend built to: dist/index.js');
    console.log('📁 API entry point: api/index.js');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildForVercel();
