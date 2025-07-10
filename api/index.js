// Vercel serverless function entry point
const path = require('path');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  next();
});

// Database setup will be handled by the main server when needed

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Login schema
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

// Simple login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    // Check if this is the admin user
    if (email === 'admin@driptech.co.ke' && password === 'admin123') {
      const token = jwt.sign(
        { id: 'admin', email: 'admin@driptech.co.ke', role: 'admin' },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );
      
      res.json({ 
        token, 
        user: { id: 'admin', email: 'admin@driptech.co.ke', name: 'Admin', role: 'admin' } 
      });
    } else {
      res.status(401).json({ 
        message: 'Invalid credentials',
        details: 'Please check your email and password'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ 
      message: 'Login failed',
      details: 'Invalid input format'
    });
  }
});

// Fallback for other routes
app.all('*', (req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: 'This endpoint is not implemented yet',
    path: req.path
  });
});

module.exports = app;