// Simplified vite setup for Vercel compatibility
import { Express } from 'express';
import { Server } from 'http';
import express from 'express';

export function log(message: string, source = "express") {
  console.log(`[${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  // Simplified for Vercel - not needed in production
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  
  // In development, this would set up Vite middleware
  // For Vercel, we skip this as it's handled differently
}

export function serveStatic(app: Express) {
  // Serve static files in production
  app.use(express.static('dist/public'));
}