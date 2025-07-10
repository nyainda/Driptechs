
import 'dotenv/config'; // This must be at the very top
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema.js";

neonConfig.webSocketConstructor = ws;

console.log('DATABASE_URL loaded:', !!process.env.DATABASE_URL); // Temporary debug line

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Support for different database providers
export const getDatabaseConfig = () => {
  const dbUrl = process.env.DATABASE_URL!;
  
  // Detect database provider from URL
  if (dbUrl.includes('supabase.co')) {
    console.log('🔗 Using Supabase PostgreSQL');
    return { provider: 'supabase', url: dbUrl };
  } else if (dbUrl.includes('neon.tech')) {
    console.log('🔗 Using Neon PostgreSQL');
    return { provider: 'neon', url: dbUrl };
  } else if (dbUrl.includes('railway.app')) {
    console.log('🔗 Using Railway PostgreSQL');
    return { provider: 'railway', url: dbUrl };
  } else if (dbUrl.includes('render.com')) {
    console.log('🔗 Using Render PostgreSQL');
    return { provider: 'render', url: dbUrl };
  } else {
    console.log('🔗 Using Generic PostgreSQL');
    return { provider: 'generic', url: dbUrl };
  }
};

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

// Database health check
export const checkDatabaseConnection = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
};
