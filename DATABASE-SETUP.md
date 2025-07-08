
# Database Setup Guide

This guide helps you set up DripTech with various database providers.

## Supported Database Providers

- **Neon** (Recommended for serverless)
- **Supabase** (Full-featured PostgreSQL)
- **Railway** (Simple deployment)
- **Render** (Managed PostgreSQL)
- **Any PostgreSQL instance**

## Quick Setup Instructions

### 1. Neon Database (Recommended)

1. Go to [Neon.tech](https://neon.tech)
2. Create a free account
3. Create a new project
4. Copy the connection string
5. Set it as `DATABASE_URL` in your environment variables

Example connection string:
```
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

### 2. Supabase Database

1. Go to [Supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string (use the pooler connection)
5. Set it as `DATABASE_URL` in your environment variables

Example connection string:
```
DATABASE_URL="postgresql://postgres.xxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
```

### 3. Railway Database

1. Go to [Railway.app](https://railway.app)
2. Create a new project
3. Add PostgreSQL service
4. Copy the DATABASE_URL from the Variables tab
5. Set it in your environment variables

### 4. Render Database

1. Go to [Render.com](https://render.com)
2. Create a PostgreSQL database
3. Copy the External Database URL
4. Set it as `DATABASE_URL` in your environment variables

## Environment Setup

### For Development (.env file)
```env
DATABASE_URL="your_database_connection_string_here"
NODE_ENV="development"
```

### For Vercel Deployment

1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add:
   - Key: `DATABASE_URL`
   - Value: Your database connection string
   - Environments: Production, Preview, Development

## Database Migration

The application automatically creates all necessary tables and demo data on first startup. No manual migration is needed.

## Demo Data

The system includes comprehensive demo data that helps you:
- See how the application works
- Test all features immediately
- Understand the data structure
- Have content to showcase

Demo data includes:
- Sample products (irrigation equipment)
- Blog posts (farming guides)
- Success stories (customer testimonials)
- Team members (company profiles)
- Sample projects (completed work)

## Troubleshooting

### Connection Issues
- Ensure your DATABASE_URL is correct
- Check if your database service is running
- Verify network connectivity
- Confirm SSL requirements

### Demo Data Not Showing
- Check server logs for initialization errors
- Ensure database permissions are correct
- Verify tables are created successfully

### Performance Issues
- Consider using connection pooling
- Monitor database resource usage
- Optimize queries if needed

## Production Considerations

1. **Security**: Use strong passwords and restrict database access
2. **Backups**: Enable automatic backups
3. **Monitoring**: Set up alerts for database health
4. **Scaling**: Choose a provider that supports your growth needs

## Support

If you encounter issues:
1. Check the server logs
2. Verify your DATABASE_URL format
3. Ensure your database provider supports PostgreSQL
4. Contact your database provider's support if needed

The application is designed to work with any PostgreSQL-compatible database, so you have flexibility in choosing your provider.
