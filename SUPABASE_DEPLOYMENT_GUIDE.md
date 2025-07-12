# Supabase + Vercel Deployment Guide

## Database Configuration

Your Supabase database is ready to use with these details:
- **URL**: https://zktflwhnljbfaypvymkw.supabase.co
- **Connection String**: postgresql://postgres:7957@db.zktflwhnljbfaypvymkw.supabase.co:5432/postgres

## Environment Variables for Vercel

Set these in your Vercel project settings:

```bash
DATABASE_URL=postgresql://postgres:7957@db.zktflwhnljbfaypvymkw.supabase.co:5432/postgres
JWT_SECRET=your-jwt-secret-key-here
SENDGRID_API_KEY=your-sendgrid-api-key (optional)
```

## Vercel Deployment Steps

### 1. Fix Runtime Configuration
The runtime error has been fixed by updating to Node.js 18.x which is fully supported by Vercel.

### 2. Deploy to Vercel
1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Add environment variables in project settings
5. Deploy

### 3. Database Setup
After deployment, initialize your database:

```bash
# This will create all tables in Supabase
npm run db:push
```

## Key Changes Made

1. **Fixed Vercel Runtime**: Changed from `nodejs20.x` to `nodejs18.x`
2. **Added Supabase Support**: Database configuration detects Supabase automatically
3. **Updated Node.js Version**: API package.json now specifies Node 18.x
4. **Single Function Architecture**: All APIs route through one serverless function

## Database Schema

Your Supabase database will have these tables:
- users, products, quotes, projects
- blog_posts, contacts, team_members
- success_stories, page_views, analytics
- achievements, user_achievements, gamification_stats

## Admin Access

After deployment:
- **URL**: https://your-project.vercel.app/admin
- **Email**: admin@driptech.co.ke
- **Password**: admin123

## Testing Database Connection

You can test your database connection with:

```sql
-- Check tables
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check admin user
SELECT * FROM users WHERE email = 'admin@driptech.co.ke';
```

## Troubleshooting

### Common Issues:
1. **Runtime Error**: Fixed by using Node.js 18.x
2. **Database Connection**: Ensure DATABASE_URL is correct
3. **Cold Start**: First request may be slow

### If Deployment Fails:
1. Check Vercel function logs
2. Verify environment variables
3. Test database connection in Supabase dashboard
4. Check build logs for errors

## Next Steps

1. Push your code to GitHub
2. Set up Vercel deployment
3. Add environment variables
4. Deploy and test
5. Initialize database with `npm run db:push`

Your project is now ready for Supabase + Vercel deployment!