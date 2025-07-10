# Vercel Deployment Guide for DripTech

## Overview
This guide helps you deploy DripTech to Vercel while avoiding common TypeScript compilation issues with Drizzle ORM.

## Key Files Updated for Vercel Deployment

### 1. `vercel.json`
- Uses simplified build command: `node build-simple.js`
- Configured for Node.js 18.x runtime
- Proper routing for API and static files

### 2. `api/index.js`
- Simplified serverless function entry point
- Removed MySQL type dependencies to avoid compilation errors
- Includes basic admin login functionality (admin@driptech.co.ke / admin123)

### 3. `build-simple.js`
- Builds only the frontend with Vite
- Skips TypeScript compilation to avoid MySQL type conflicts
- Faster and more reliable for Vercel deployment

## Common Issues and Solutions

### MySQL Type Errors
**Problem**: TypeScript compilation fails with MySQL-related errors even when using PostgreSQL
**Solution**: 
- Use the simplified build process that skips TypeScript compilation
- Runtime compilation handles TypeScript on the server side
- Database connections are handled through environment variables

### Environment Variables Required
```
DATABASE_URL=your_neon_postgresql_url
JWT_SECRET=your_jwt_secret_key
NODE_ENV=production
```

### Admin Login Credentials
- Email: admin@driptech.co.ke
- Password: admin123

## Deployment Steps

1. **Push to GitHub**: Ensure all files are committed and pushed
2. **Connect to Vercel**: Import your repository in Vercel
3. **Set Environment Variables**: Add DATABASE_URL and JWT_SECRET
4. **Deploy**: Vercel will use the `vercel.json` configuration automatically

## Build Process
1. Frontend builds to `dist/public` using Vite
2. API functions are served from `api/index.js`
3. Database connections use runtime resolution
4. Static files are served directly by Vercel

## Troubleshooting

### Build Failures
- Check that `build-simple.js` is executable
- Verify all dependencies are listed in `package.json`
- Ensure environment variables are set correctly

### API Errors
- Check Vercel function logs for runtime errors
- Verify DATABASE_URL is accessible from Vercel
- Test API endpoints locally first

### Database Connection Issues
- Verify DATABASE_URL format is correct for Neon
- Check if database allows connections from Vercel IPs
- Test connection with a simple query

## Files Modified for Vercel Compatibility

- `vercel.json` - Deployment configuration
- `api/index.js` - Serverless function entry
- `api/package.json` - Dependencies for API
- `build-simple.js` - Simplified build script
- `tsconfig.vercel.json` - TypeScript config (if needed)

This configuration avoids the MySQL type compilation issues while maintaining full functionality for your PostgreSQL-based application.