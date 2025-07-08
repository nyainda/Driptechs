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
      build: {
        outDir: 'dist/public',
        emptyOutDir: true
      }
    });
    
    console.log('✅ Build completed successfully!');
    console.log('📁 Frontend built to: dist/public');
    console.log('📁 Backend will be handled by Vercel directly from server/index.ts');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildForVercel();