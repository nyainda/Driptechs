
# Vercel Environment Variables Setup

## Required Environment Variables

Set these in your Vercel dashboard under Settings > Environment Variables:

### Database
```
DATABASE_URL=postgresql://username:password@hostname:port/database_name
```

### JWT Authentication
```
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
```

### Email Service (SendGrid)
```
SENDGRID_API_KEY=SG.your-sendgrid-api-key-here
```

### Optional Environment Variables
```
NODE_ENV=production
```

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add each variable with:
   - **Name**: The variable name (e.g., `DATABASE_URL`)
   - **Value**: The actual value
   - **Environment**: Select "Production", "Preview", and "Development"

## Database Setup

### Option 1: Vercel Postgres (Recommended)
1. In Vercel dashboard, go to Storage tab
2. Create a new Postgres database
3. Copy the connection string to `DATABASE_URL`

### Option 2: External Postgres
Use services like:
- Neon (neon.tech)
- Supabase
- Railway
- AWS RDS

## SendGrid Setup

1. Sign up at sendgrid.com
2. Create an API key
3. Set it as `SENDGRID_API_KEY`

## Testing Environment Variables

After setting them up, redeploy your application. Check the deployment logs to ensure no environment variable errors.
