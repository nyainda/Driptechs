#!/usr/bin/env node

// Simple build script for client
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

async function buildClient() {
  console.log('🔄 Building React client...');
  
  try {
    // Change to client directory
    process.chdir('client');
    
    // Run build with timeout
    const buildProcess = spawn('npm', ['run', 'build'], {
      stdio: 'inherit',
      timeout: 120000 // 2 minutes timeout
    });
    
    buildProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Client build completed successfully');
        
        // Check if dist folder exists
        if (fs.existsSync('dist')) {
          console.log('✅ Client dist folder created');
          
          // List contents
          const files = fs.readdirSync('dist');
          console.log('📁 Build files:', files);
        } else {
          console.log('❌ Client dist folder not found');
        }
      } else {
        console.log(`❌ Client build failed with code ${code}`);
      }
    });
    
    buildProcess.on('error', (error) => {
      console.error('❌ Build process error:', error);
    });
    
  } catch (error) {
    console.error('❌ Build script error:', error);
  }
}

buildClient();