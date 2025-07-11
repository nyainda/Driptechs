# Vercel Deployment Guide for DripTech

## Overview

This guide covers deploying the DripTech irrigation website to Vercel. The project uses a single serverless function approach to stay within the free plan limits.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Environment Variables**: Prepare your environment variables

## Required Environment Variables

Set these in your Vercel project settings:

```bash
DATABASE_URL=your_neon_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
SENDGRID_API_KEY=your_sendgrid_api_key (optional)
```

## Deployment Steps

### 1. Connect GitHub Repository

1. Go to [vercel.com/new](https://vercel.com/new)
2. Select "Import Git Repository"
3. Choose your DripTech repository
4. Click "Import"

### 2. Configure Build Settings

Vercel will automatically detect the configuration from `vercel.json`:

- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`

### 3. Set Environment Variables

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add the required variables listed above

### 4. Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your site will be available at `https://your-project.vercel.app`

## Project Structure

```
project-root/
├── api/
│   ├── index.js          # Main serverless function
│   ├── package.json      # API dependencies
│   └── shared/
│       └── schema.js     # Database schema
├── client/               # React frontend
├── vercel.json          # Vercel configuration
├── .vercelignore        # Files to ignore during deployment
└── package.json         # Root dependencies
```

## Key Features

- **Single Serverless Function**: All API routes handled by `api/index.js`
- **SPA Routing**: All client routes redirect to `index.html`
- **PostgreSQL Support**: Uses Neon for database
- **JWT Authentication**: Secure admin login
- **Free Plan Compatible**: Stays within Vercel's free tier limits

## Admin Access

After deployment, you can access the admin dashboard at:
- URL: `https://your-project.vercel.app/admin`
- Email: `admin@driptech.co.ke`
- Password: `admin123`

## Troubleshooting

### Build Errors

1. **"Failed to resolve /src/main.tsx"**: This was fixed by updating the build configuration
2. **"Too many serverless functions"**: Resolved by using single function approach
3. **Import/dependency issues**: All dependencies are included in `api/package.json`

### Runtime Errors

1. **Database connection**: Ensure `DATABASE_URL` is properly set
2. **404 on routes**: Check that `vercel.json` has proper SPA routing configuration
3. **API errors**: Check function logs in Vercel dashboard

### Performance Tips

1. **Cold starts**: First request may be slower due to serverless cold start
2. **Database connections**: Uses connection pooling for better performance
3. **Static assets**: Automatically served from CDN

## Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Function logs**: Available in Vercel dashboard
- **Database metrics**: Monitor in Neon dashboard

## Support

For deployment issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test database connectivity
4. Review build logs for errors

## Updates

To update the deployment:
1. Push changes to your GitHub repository
2. Vercel will automatically redeploy
3. Check deployment status in Vercel dashboard

## Cost Optimization

This configuration is optimized for Vercel's free tier:
- Single serverless function (limit: 12 functions)
- Bandwidth efficient (limit: 100GB/month)
- Fast builds (limit: 6000 build minutes/month)
- No additional add-ons required

## Security

- Environment variables are encrypted
- HTTPS by default
- JWT tokens for authentication
- SQL injection protection via Drizzle ORM
- CORS configuration for API security