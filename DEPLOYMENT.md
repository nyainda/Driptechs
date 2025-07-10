# DripTech Deployment Guide

## Vercel Deployment

### Prerequisites
- Vercel account
- PostgreSQL database (Neon, Supabase, or similar)
- SendGrid API key (optional, for email functionality)

### Step 1: Prepare Environment Variables
Set these environment variables in your Vercel project settings:

```bash
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret_key
SENDGRID_API_KEY=your_sendgrid_api_key
NODE_ENV=production
```

### Step 2: Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the configuration from `vercel.json`
3. The build process will:
   - Install dependencies in the client directory
   - Build the React frontend to `client/dist`
   - Deploy the API as serverless functions
   - Configure routing for both frontend and API

### Important Notes for Vercel
- The `vercel.json` configuration uses `@vercel/static-build` for the frontend
- The client build output goes to `client/dist` (not `../dist/public`)
- API functions are deployed from the `api/` directory
- Environment variables must be set in Vercel dashboard

### Step 3: Database Setup
After deployment, your database will be automatically initialized with:
- Admin user: `admin@driptech.co.ke` / `admin123`
- Sample products and content
- Required database tables

### Project Structure
```
├── api/
│   ├── index.js          # Serverless API entry point
│   └── package.json      # API dependencies
├── client/
│   ├── src/              # React frontend source
│   ├── dist/             # Built frontend (auto-generated)
│   └── package.json      # Frontend dependencies
├── server/               # Backend logic
├── shared/               # Shared types and schemas
└── vercel.json          # Vercel configuration
```

### API Routes
All API endpoints are available at `/api/*`:
- `/api/products` - Product management
- `/api/quotes` - Quote handling
- `/api/contacts` - Contact form submissions
- `/api/admin/*` - Admin functionality

### Frontend Routes
- `/` - Home page
- `/products` - Product catalog
- `/about` - About page
- `/contact` - Contact form
- `/admin` - Admin dashboard (protected)

### Troubleshooting
- If you get 404 errors, check that environment variables are set
- For database connection issues, verify your `DATABASE_URL`
- Admin login: `admin@driptech.co.ke` / `admin123`