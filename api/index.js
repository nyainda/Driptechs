
// Vercel serverless function entry point
const express = require('express');
const path = require('path');

// Import the compiled server
const app = require('../dist/index.js').default || require('../dist/index.js');

// Export the Express app for Vercel
module.exports = app;
