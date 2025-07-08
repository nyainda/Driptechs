# Vercel Deployment Guide

## Quick Deploy to Vercel

1. **Push your code to GitHub**
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect the configuration

3. **Set Environment Variables in Vercel:**
   ```
   DATABASE_URL=your_postgres_connection_string
   SENDGRID_API_KEY=your_sendgrid_api_key
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Deploy:**
   - Vercel will automatically build and deploy
   - Uses the `vercel.json` configuration
   - Build command: `npm run build`
   - Output directory: `dist/public`

## Database Setup for Production

If using Vercel Postgres:
1. Create a Vercel Postgres database
2. Get the connection string
3. Run schema migration: `npm run db:push`

If using external PostgreSQL:
1. Use services like Neon, Supabase, or AWS RDS
2. Set the `DATABASE_URL` environment variable
3. Run schema migration

## Build Process

The build process:
1. Frontend: Vite builds React app to `dist/public`
2. Backend: esbuild compiles TypeScript server to `dist/index.js`
3. Vercel serves static files and runs the server function

## Troubleshooting

- Ensure all environment variables are set in Vercel dashboard
- Check build logs for any dependency issues
- Verify database connection string format
- Make sure all required secrets are configured

## Manual Build Test

To test the build locally:
```bash
npm run build
npm start
```

The app should run on the configured port and serve both frontend and API endpoints.