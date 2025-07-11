# Vercel Free Plan Deployment Setup

## Issue
The Vercel Hobby (free) plan limits deployments to 12 serverless functions maximum. The current setup was creating more than 12 functions.

## Solution
The deployment has been configured to use only 1 serverless function (`api/index.ts`) that handles all API routes.

## Configuration Changes Made

### 1. Single Function Entry Point
- All API routes go through `api/index.ts`
- This single function handles all endpoints: `/api/*`

### 2. Vercel Configuration (`vercel.json`)
```json
{
  "version": 2,
  "buildCommand": "cd client && npm install && npm run build && cd ../api && npm install",
  "outputDirectory": "client/dist",
  "functions": {
    "api/index.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.ts"
    },
    {
      "source": "/((?!api/.*).*)",
      "destination": "/index.html"
    }
  ]
}
```

### 3. Function Exclusions (`.vercelignore`)
- Excludes unnecessary files that might be detected as functions
- Keeps only essential files for deployment

## Free Plan Limits
- **Serverless Functions**: 12 max (we use 1)
- **Function Duration**: 10 seconds (we set 30s, might be limited)
- **Function Size**: 50MB max
- **Invocations**: 100GB-hours/month

## Deployment Steps
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NODE_ENV`: Set to "production"
4. Deploy

## Expected Result
- Single serverless function handling all API routes
- Static site for the frontend
- Full functionality maintained within free plan limits

## Testing
All these API endpoints should work after deployment:
- `POST /api/auth/login`
- `GET /api/products`
- `POST /api/quotes`
- `GET /api/admin/analytics`
- And all other existing endpoints

The deployment will now work within the free plan's 12 function limit!