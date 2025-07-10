#!/usr/bin/env node

// Generate a secure JWT secret for your Vercel deployment
import crypto from 'crypto';

// Generate a 64-character random string
const jwtSecret = crypto.randomBytes(32).toString('hex');

console.log('='.repeat(60));
console.log('JWT SECRET FOR VERCEL DEPLOYMENT');
console.log('='.repeat(60));
console.log('');
console.log('Copy this JWT_SECRET and add it to your Vercel environment variables:');
console.log('');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log('');
console.log('Steps to add to Vercel:');
console.log('1. Go to your Vercel dashboard');
console.log('2. Select your project');
console.log('3. Go to Settings > Environment Variables');
console.log('4. Add a new variable:');
console.log('   - Key: JWT_SECRET');
console.log(`   - Value: ${jwtSecret}`);
console.log('5. Save and redeploy');
console.log('');
console.log('='.repeat(60));