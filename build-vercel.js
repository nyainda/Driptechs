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
      build: {
        outDir: 'dist/public',
        emptyOutDir: true
      }
    });
    
    // Build backend with esbuild
    console.log('⚙️  Building backend...');
    await esbuild({
      entryPoints: ['server/index.ts'],
      bundle: true,
      platform: 'node',
      target: 'node18',
      format: 'esm',
      external: [
        'bcrypt',
        'better-sqlite3',
        '@neondatabase/serverless',
        'pg-query-stream',
        'drizzle-orm',
        'postgres'
      ],
      outfile: 'dist/index.js',
      banner: {
        js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);'
      }
    });
    
    // Create package.json for deployment
    const packageJson = {
      type: 'module',
      dependencies: {
        bcrypt: '^5.1.0',
        'drizzle-orm': '^0.28.0',
        postgres: '^3.4.0',
        '@sendgrid/mail': '^8.1.0'
      }
    };
    
    fs.writeFileSync('dist/package.json', JSON.stringify(packageJson, null, 2));
    
    console.log('✅ Build completed successfully!');
    console.log('📁 Frontend built to: dist/public');
    console.log('📁 Backend built to: dist/index.js');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildForVercel();