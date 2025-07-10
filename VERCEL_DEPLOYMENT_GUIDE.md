# Vercel Deployment Guide - DripTech Irrigation Website

## Overview

This guide provides step-by-step instructions for deploying the DripTech irrigation website to Vercel. The application uses a modern full-stack architecture with React frontend and Node.js/Express backend.

## Prerequisites

### Required Accounts & Setup
1. **Vercel Account**: Sign up at https://vercel.com
2. **GitHub Repository**: Ensure your code is pushed to GitHub
3. **Neon Database**: PostgreSQL database (existing setup)
4. **SendGrid Account**: For email functionality (optional)

### Environment Variables Required
```
DATABASE_URL=postgresql://username:password@host/database
JWT_SECRET=your-super-secret-jwt-key-here
SENDGRID_API_KEY=SG.your-sendgrid-api-key-here (optional)
```

## Deployment Steps

### Step 1: Prepare Your Repository
1. Ensure all code is committed and pushed to GitHub main branch
2. Verify the following files exist in your repository:
   - `vercel.json` - Vercel configuration
   - `api/index.js` - Serverless function entry point
   - `api/package.json` - Serverless dependencies
   - `build-vercel.js` - Custom build script

### Step 2: Connect to Vercel
1. Go to https://vercel.com and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select the repository: `nyainda/Driptechs`

### Step 3: Configure Build Settings
In Vercel dashboard:

**Framework Preset**: Other
**Root Directory**: `./` (leave empty)
**Build Command**: `npm run build:vercel`
**Output Directory**: `dist/public`
**Install Command**: `npm install`
**Node.js Version**: 20.x

### Step 4: Environment Variables
Add these environment variables in Vercel:

1. Go to your project → Settings → Environment Variables
2. Add each variable:

```
DATABASE_URL = postgresql://your-neon-db-url
JWT_SECRET = your-jwt-secret-minimum-32-characters
SENDGRID_API_KEY = SG.your-sendgrid-key (optional)
NODE_ENV = production
```

### Step 5: Deploy
1. Click "Deploy" button
2. Wait for build to complete (typically 2-3 minutes)
3. Your site will be available at: `https://your-project.vercel.app`

## Vercel Configuration Details

### Build Process
The `build:vercel` script:
1. Cleans previous builds
2. Builds React frontend with Vite
3. Creates optimized production bundle
4. Sets up serverless function configuration

### Serverless Function
- **Entry Point**: `api/index.js`
- **Runtime**: Node.js 20.x
- **Module Type**: ES Modules
- **Cold Start**: ~500-800ms (first request)
- **Timeout**: 10 seconds (Hobby plan)

### File Structure After Build
```
dist/
├── public/           # Frontend static files
│   ├── index.html
│   ├── assets/
│   └── ...
api/
├── index.js         # Serverless function
├── package.json     # Runtime dependencies
```

## Database Configuration

### Neon PostgreSQL
The application uses Neon PostgreSQL with the following features:
- Connection pooling enabled
- SSL required (automatically handled)
- Serverless-friendly (no persistent connections)

### Schema Migration
Database tables are created automatically on first deployment using Drizzle ORM migrations.

## API Routes

All API endpoints are available under `/api/*`:
- `/api/health` - Health check
- `/api/products` - Product management
- `/api/quotes` - Quote system
- `/api/admin/*` - Admin dashboard
- `/api/contact` - Contact forms

## Troubleshooting

### Common Build Errors

**Error: "Module not found"**
- Ensure all dependencies are in `package.json`
- Check import paths use correct casing
- Verify all UI components exist

**Error: "Database connection failed"**
- Verify `DATABASE_URL` is set correctly
- Check Neon database is active
- Ensure IP allowlist includes Vercel IPs (0.0.0.0/0)

**Error: "Function timeout"**
- Cold starts can be slow
- Database initialization takes time on first request
- Consider upgrading to Vercel Pro for better performance

### Performance Optimization

1. **Frontend Optimization**:
   - Code splitting enabled
   - Asset compression
   - CDN delivery via Vercel Edge Network

2. **Backend Optimization**:
   - Lazy initialization
   - Connection pooling
   - Minimal bundle size

3. **Database Optimization**:
   - Indexed queries
   - Connection reuse
   - Query optimization

## Custom Domain Setup

### Add Custom Domain
1. Go to Project Settings → Domains
2. Add your domain: `www.driptech.co.ke`
3. Configure DNS records:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### SSL Certificate
- Automatically provisioned by Vercel
- Supports wildcard certificates
- Auto-renewal enabled

## Monitoring & Analytics

### Built-in Vercel Analytics
- Real-time performance metrics
- Error tracking
- Function execution logs

### Application Monitoring
- Health check endpoint: `/api/health`
- Database connection status
- Error logging via console

## Environment-Specific Configurations

### Production Environment
- Minified assets
- Production database
- Error reporting enabled
- Analytics tracking active

### Preview Deployments
- Automatic for each pull request
- Separate database recommended
- Testing environment

## Security Considerations

### Environment Variables
- Never commit secrets to repository
- Use Vercel's encrypted storage
- Rotate keys regularly

### CORS Configuration
- Configured for production domains
- Whitelist specific origins
- Credentials support enabled

### Rate Limiting
- Implemented via middleware
- Per-IP request limiting
- API endpoint protection

## Support & Maintenance

### Logs & Debugging
- Vercel Function logs: Dashboard → Functions
- Real-time logs via Vercel CLI: `vercel logs`
- Error tracking in browser console

### Updates & Deployments
- Automatic deployments on `main` branch push
- Preview deployments for pull requests
- Rollback capability via Vercel dashboard

### Scaling Considerations
- Vercel automatically scales functions
- Database connection pooling
- Consider upgrading plan for high traffic

## Admin Access

### Default Admin Credentials
```
Email: admin@driptech.co.ke
Password: admin123
```

**Important**: Change default credentials immediately after deployment.

### Admin Features
- Product management
- Quote processing
- User management
- Analytics dashboard
- Content management

## Backup & Recovery

### Database Backups
- Neon provides automatic backups
- Point-in-time recovery available
- Export capabilities via dashboard

### Code Recovery
- GitHub repository as source of truth
- Vercel deployment history
- Easy rollback via dashboard

---

## Quick Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Environment variables configured
- [ ] Database accessible
- [ ] Build script tested locally
- [ ] Vercel project created
- [ ] Deployment successful
- [ ] Health check passing
- [ ] Admin login working
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active

For issues or questions, refer to:
- Vercel Documentation: https://vercel.com/docs
- Neon Documentation: https://neon.tech/docs
- DripTech Support: admin@driptech.co.ke