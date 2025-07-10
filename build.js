// Simple build script for Vercel
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function build() {
  console.log('🏗️  Building for Vercel deployment...');
  
  try {
    // Build frontend
    console.log('📦 Building frontend...');
    execSync('npm run build:frontend', { stdio: 'inherit' });
    
    // Build backend
    console.log('🔧 Building backend...');
    execSync('npm run build:backend', { stdio: 'inherit' });
    
    console.log('✅ Build completed successfully!');
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

build();