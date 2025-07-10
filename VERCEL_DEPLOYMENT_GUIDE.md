# DripTech Vercel Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the DripTech irrigation website to Vercel with PostgreSQL database support.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **PostgreSQL Database**: Set up a PostgreSQL database (recommended: Neon, Supabase, or PlanetScale)
3. **GitHub Repository**: Code should be pushed to GitHub
4. **Admin Credentials**: Default admin login is `admin@driptech.co.ke` / `admin123`

## Database Setup

### Option 1: Neon Database (Recommended)
1. Visit [neon.tech](https://neon.tech) and create an account
2. Create a new project and database
3. Copy the connection string (starts with `postgresql://`)

### Option 2: Supabase
1. Visit [supabase.com](https://supabase.com) and create a project
2. Go to Settings > Database
3. Copy the connection string

### Option 3: PlanetScale
1. Visit [planetscale.com](https://planetscale.com) and create a database
2. Create connection credentials
3. Use the provided connection string

## Vercel Deployment Steps

### 1. Connect Repository
1. Log into Vercel dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Select the main branch

### 2. Configure Build Settings
Vercel will automatically detect the configuration from `vercel.json`. No manual configuration needed.

### 3. Environment Variables
Add these environment variables in Vercel dashboard:

**Required:**
```
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
NODE_ENV=production
```

**Optional:**
```
JWT_SECRET=your-secret-key-here
SENDGRID_API_KEY=your-sendgrid-key-here
```

### 4. Deploy
1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be available at `your-app-name.vercel.app`

## Post-Deployment Setup

### 1. Database Initialization
The application will automatically:
- Create necessary database tables
- Set up the admin user account
- Initialize demo data

### 2. Admin Access
- Login URL: `https://your-app-name.vercel.app/admin`
- Username: `admin@driptech.co.ke`
- Password: `admin123`

### 3. Testing
Test these features:
- [ ] Homepage loads correctly
- [ ] Product catalog displays
- [ ] Quote form submission
- [ ] Admin login works
- [ ] Quote management functions
- [ ] Invoice generation

## Troubleshooting

### Build Failures
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify environment variables are set

### Database Connection Issues
1. Verify `DATABASE_URL` is correct
2. Check database allows external connections
3. Ensure SSL is enabled (`?sslmode=require`)

### Runtime Errors
1. Check Function Logs in Vercel dashboard
2. Verify environment variables in production
3. Check database schema is properly initialized

## Performance Optimization

### 1. Database Optimization
- Use connection pooling
- Index frequently queried columns
- Regular database maintenance

### 2. Vercel Configuration
- Enable Edge Functions for better performance
- Configure proper caching headers
- Use Vercel Analytics for monitoring

## Monitoring and Maintenance

### 1. Error Tracking
- Monitor Vercel Function Logs
- Set up alerts for critical errors
- Track application performance

### 2. Database Monitoring
- Monitor connection usage
- Track query performance
- Regular backup schedule

### 3. Updates
- Keep dependencies updated
- Monitor security advisories
- Test staging before production

## Security Considerations

### 1. Environment Variables
- Never commit secrets to repository
- Use Vercel's secure environment variable storage
- Rotate secrets regularly

### 2. Database Security
- Use strong passwords
- Enable SSL connections
- Regular security updates

### 3. Application Security
- JWT tokens are securely signed
- Admin routes are protected
- Input validation on all forms

## Support and Resources

### Documentation
- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)

### Getting Help
- Check Vercel Community forums
- Review application logs
- Contact support if needed

## Conclusion

This deployment configuration provides a robust, scalable solution for the DripTech irrigation website with:
- Serverless PostgreSQL database
- Automatic SSL certificates
- Global CDN distribution
- Professional email integration
- Comprehensive admin dashboard

The application is production-ready with proper error handling, security measures, and performance optimizations.