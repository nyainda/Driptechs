#!/usr/bin/env node
import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

async function buildForVercel() {
  console.log('🔨 Building DripTech for Vercel deployment...');
  
  try {
    // Ensure client directory exists
    if (!existsSync('client')) {
      throw new Error('Client directory not found');
    }
    
    // Build the frontend
    console.log('📦 Building frontend...');
    execSync('cd client && npm install', { stdio: 'inherit' });
    execSync('cd client && npm run build', { stdio: 'inherit' });
    
    // Ensure API directory and dependencies are correct
    console.log('⚙️  Preparing API for serverless deployment...');
    
    // Create environment config for Vercel
    const envConfig = `
# Vercel Environment Configuration
# Add these variables to your Vercel project settings:
# 
# DATABASE_URL=your_postgres_connection_string
# JWT_SECRET=your_jwt_secret_key
# SENDGRID_API_KEY=your_sendgrid_api_key (optional)
# NODE_ENV=production
    `.trim();
    
    writeFileSync('.env.example', envConfig);
    
    console.log('✅ Build completed successfully!');
    console.log('📋 Next steps for Vercel deployment:');
    console.log('1. Set environment variables in Vercel dashboard');
    console.log('2. Deploy the project to Vercel');
    console.log('3. Your API will be available at /api/* routes');
    console.log('4. Your frontend will be served from the root domain');
    
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

buildForVercel();