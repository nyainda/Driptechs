# DripTech Irrigation - Vercel Deployment Guide

## Overview
This guide walks you through deploying the DripTech Irrigation website to Vercel with both frontend and backend functionality.

## Prerequisites
1. Vercel account (free plan works)
2. GitHub repository with your project
3. PostgreSQL database (Neon recommended)

## Environment Variables Required
Set these in your Vercel dashboard under Project Settings > Environment Variables:

```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
SENDGRID_API_KEY=your_sendgrid_api_key (optional)
NODE_ENV=production
```

## Deployment Steps

### 1. Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the project

### 2. Configure Build Settings
Vercel should automatically detect the configuration from `vercel.json`, but ensure:
- **Framework Preset**: Other
- **Build Command**: `npm run build:frontend`
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`

### 3. Set Environment Variables
In Project Settings > Environment Variables, add:
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: A secure random string for JWT tokens
- `NODE_ENV`: Set to `production`
- `SENDGRID_API_KEY`: (Optional) For email functionality

### 4. Deploy
Click "Deploy" and wait for the build to complete.

## Database Setup
1. **Create PostgreSQL Database**: Use Neon, Railway, or Supabase
2. **Get Connection String**: Copy your database URL
3. **Set Environment Variable**: Add `DATABASE_URL` in Vercel
4. **Database Tables**: Tables will be created automatically on first deployment

## API Endpoints
All API routes are available under `/api/` and will work seamlessly:
- `/api/products` - Product catalog
- `/api/quotes` - Quote management
- `/api/login` - Admin authentication
- `/api/projects` - Project portfolio
- `/api/blog` - Blog posts
- `/api/contacts` - Contact forms

## Frontend Routes
All client-side routes work correctly with SPA routing:
- `/` - Homepage
- `/products` - Product catalog
- `/services` - Services page
- `/projects` - Projects portfolio
- `/about` - About page
- `/contact` - Contact page
- `/blog` - Blog
- `/quote` - Quote request
- `/admin` - Admin dashboard

## Troubleshooting

### Build Errors
- Ensure all dependencies are in `package.json`
- Check that `dist/public` directory is created during build
- Verify Node.js version compatibility (Node 20.x recommended)

### API Not Working
- Check environment variables are set correctly
- Verify DATABASE_URL is accessible from Vercel
- Check function logs in Vercel dashboard

### 404 Errors
- Ensure `vercel.json` is properly configured
- Check that rewrites are directing correctly
- Verify static files are in correct directory

### Database Connection Issues
- Test DATABASE_URL connection string
- Ensure database allows connections from Vercel IPs
- Check database is accessible from external sources

## Performance Optimization
- Static files are served from CDN
- API functions are serverless (automatic scaling)
- Database queries are optimized
- Images are served as SVG placeholders (lightweight)

## Security Features
- JWT authentication for admin routes
- CORS properly configured
- Environment variables secured
- SQL injection protection via Drizzle ORM

## Monitoring
- Check Vercel dashboard for function logs
- Monitor database performance
- Review error logs for issues

## Support
For deployment issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test database connectivity
4. Contact support if needed

## Database Admin Credentials
Default admin account:
- Email: admin@driptech.co.ke
- Password: admin123

Change these credentials after first login for security.