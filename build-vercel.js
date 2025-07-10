


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
      configFile: path.resolve(process.cwd(), 'vite.config.ts'),
      mode: 'production'
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
      external: [
        'better-sqlite3', 
        'pg-native',
        'pg',
        'bcrypt',
        'jsonwebtoken',
        '@sendgrid/mail',
        '@neondatabase/serverless',
        'drizzle-orm',
        'postgres',
        'zod',
        'nanoid',
        'uuid'
      ],
      define: {
        'process.env.NODE_ENV': '"production"'
      },
      banner: {
        js: '// Compiled by esbuild for Vercel deployment'
      },
      minify: true
    });
    
    // Ensure the API directory structure exists
    const apiDir = path.join(process.cwd(), 'api');
    if (!fs.existsSync(apiDir)) {
      fs.mkdirSync(apiDir, { recursive: true });
    }
    
    // Copy package.json dependencies info for Vercel
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const serverlessPackage = {
      name: packageJson.name,
      version: packageJson.version,
      type: "commonjs",
      dependencies: {
        express: packageJson.dependencies.express,
        bcrypt: packageJson.dependencies.bcrypt,
        jsonwebtoken: packageJson.dependencies.jsonwebtoken,
        '@sendgrid/mail': packageJson.dependencies['@sendgrid/mail'],
        drizzle: packageJson.dependencies.drizzle,
        'drizzle-orm': packageJson.dependencies['drizzle-orm'],
        postgres: packageJson.dependencies.postgres,
        zod: packageJson.dependencies.zod
      }
    };
    
    fs.writeFileSync(
      path.join(apiDir, 'package.json'),
      JSON.stringify(serverlessPackage, null, 2)
    );
    
    console.log('✅ Build completed successfully!');
    console.log('📁 Frontend built to: dist/public');
    console.log('📁 Backend built to: dist/index.js');
    console.log('📁 API entry point: api/index.js');
    console.log('📁 API package.json created');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildForVercel();
