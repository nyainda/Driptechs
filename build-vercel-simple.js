import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

async function buildForVercel() {
  console.log('🏗️  Building for Vercel deployment...');
  
  try {
    // Clean dist directory
    if (fs.existsSync('dist')) {
      fs.rmSync('dist', { recursive: true, force: true });
    }
    fs.mkdirSync('dist', { recursive: true });

    // Build frontend using the existing working build process
    console.log('📦 Building frontend...');
    process.chdir('client');
    execSync('npm install', { stdio: 'inherit' });
    execSync('npx vite build --config ../vite.config.ts', { stdio: 'inherit' });
    process.chdir('..');
    
    console.log('✅ Frontend build completed');
    
    // Create simplified package.json for serverless function
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const serverlessPackage = {
      name: packageJson.name,
      version: packageJson.version,
      type: "module",
      dependencies: {
        "express": packageJson.dependencies.express,
        "cors": packageJson.dependencies.cors,
        "dotenv": packageJson.dependencies.dotenv,
        "bcrypt": packageJson.dependencies.bcrypt,
        "jsonwebtoken": packageJson.dependencies.jsonwebtoken,
        "@sendgrid/mail": packageJson.dependencies['@sendgrid/mail'],
        "drizzle-orm": packageJson.dependencies['drizzle-orm'],
        "@neondatabase/serverless": packageJson.dependencies['@neondatabase/serverless'],
        "postgres": packageJson.dependencies.postgres,
        "zod": packageJson.dependencies.zod,
        "nanoid": packageJson.dependencies.nanoid,
        "uuid": packageJson.dependencies.uuid,
        "drizzle-zod": packageJson.dependencies['drizzle-zod']
      }
    };
    
    // Ensure api directory exists
    if (!fs.existsSync('api')) {
      fs.mkdirSync('api', { recursive: true });
    }
    
    fs.writeFileSync('api/package.json', JSON.stringify(serverlessPackage, null, 2));
    
    console.log('✅ Build completed successfully!');
    console.log('📁 Frontend built to: dist/public');
    console.log('📁 API entry point: api/index.js');
    console.log('📁 Serverless package.json created');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildForVercel();