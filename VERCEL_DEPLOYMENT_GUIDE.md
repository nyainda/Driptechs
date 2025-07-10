# Vercel Deployment Guide for DripTech

## Quick Setup

1. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Connect your GitHub repository
   - Import your project

2. **Environment Variables**
   Add these environment variables in Vercel dashboard:
   ```
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_here
   NODE_ENV=production
   ```

3. **Deploy**
   - Vercel will automatically build and deploy
   - The build process will run `cd client && npm install && npm run build`
   - API endpoints will be available at `/api/*`

## Project Structure

```
/api/index.ts          # Vercel serverless function entry point
/client/               # React frontend
/server/               # Express.js backend code
/shared/               # Shared types and schemas
vercel.json           # Vercel configuration
```

## How it Works

- **Frontend**: React app built with Vite, served as static files
- **Backend**: Express.js app wrapped as Vercel serverless function
- **Database**: PostgreSQL with Drizzle ORM
- **API Routes**: All backend routes accessible via `/api/*`

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure DATABASE_URL is set correctly
2. **Build Errors**: Check that all dependencies are in client/package.json
3. **API Routes**: All backend routes should be prefixed with `/api/`

### Build Process

The build process:
1. Installs client dependencies
2. Builds React app with Vite
3. Deploys static files to Vercel CDN
4. Wraps Express app as serverless function

## Testing Locally

```bash
# Run development server
npm run dev

# Test build
cd client && npm run build
```

## Admin Access

Default admin credentials:
- Email: admin@driptech.co.ke
- Password: admin123

Make sure to change these in production!