import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema.js";

neonConfig.webSocketConstructor = ws;

export const getDatabaseConfig = () => {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }

  console.log('DATABASE_URL loaded:', !!databaseUrl);
  
  // Check if it's a Neon database URL
  if (databaseUrl.includes('neon.tech') || databaseUrl.includes('neon.database.')) {
    console.log('🔗 Using Neon PostgreSQL');
    return {
      provider: 'neon',
      url: databaseUrl
    };
  }
  
  // Check if it's a local PostgreSQL
  if (databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1')) {
    console.log('🔗 Using Local PostgreSQL');
    return {
      provider: 'local',
      url: databaseUrl
    };
  }
  
  // Default to treating as standard PostgreSQL
  console.log('🔗 Using Standard PostgreSQL');
  return {
    provider: 'standard',
    url: databaseUrl
  };
};

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

export const checkDatabaseConnection = async () => {
  try {
    const config = getDatabaseConfig();
    console.log(`🗄️  Database provider: ${config.provider}`);
    
    // Test the connection
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
};