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
   - The build process will install dependencies and build the frontend
   - API endpoints will be available at `/api/*`

## Project Structure (Updated)

```
/api/
  ├── index.ts         # Vercel serverless function entry point
  ├── package.json     # API dependencies
  ├── tsconfig.json    # TypeScript configuration
  ├── server/          # Express.js backend code (copied)
  └── shared/          # Shared types and schemas (copied)
/client/               # React frontend
/server/               # Original Express.js backend code
/shared/               # Original shared types and schemas
vercel.json           # Vercel configuration
```

## How it Works

- **Frontend**: React app built with Vite, served as static files from `/client/dist/`
- **Backend**: Express.js app wrapped as Vercel serverless function in `/api/`
- **Database**: PostgreSQL with Drizzle ORM
- **API Routes**: All backend routes accessible via `/api/*`

## Fixed Issues

✅ **Missing package.json**: Added `api/package.json` with all required dependencies
✅ **Module imports**: Fixed import paths to use local copies in `/api/` directory
✅ **TypeScript config**: Added proper `tsconfig.json` for the API
✅ **Build structure**: Updated `vercel.json` to use proper build configuration

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure DATABASE_URL is set correctly
2. **Build Errors**: Check that all dependencies are in both `package.json` files
3. **API Routes**: All backend routes should be prefixed with `/api/`
4. **Import Errors**: Make sure all imports use `.js` extensions for ES modules

### Build Process

The build process:
1. Installs API dependencies in `/api/` directory
2. Installs client dependencies in `/client/` directory
3. Builds React app with Vite to `/client/dist/`
4. Compiles TypeScript serverless function in `/api/`
5. Deploys static files and serverless function to Vercel

## Testing Locally

```bash
# Run development server (uses original structure)
npm run dev

# Test client build
cd client && npm run build

# Test API structure
cd api && npm install
```

## Admin Access

Default admin credentials:
- Email: admin@driptech.co.ke
- Password: admin123

Make sure to change these in production!

## Next Steps

1. Commit all changes to GitHub
2. Push to your repository
3. Vercel will automatically trigger a new deployment
4. Check the build logs for any remaining issues

The deployment should now work properly with the fixed structure!