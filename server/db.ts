import 'dotenv/config'; // This must be at the very top
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

console.log('DATABASE_URL loaded:', !!process.env.DATABASE_URL); // Temporary debug line

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

export const successStories = pgTable("success_stories", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  client: text("client").notNull(),
  projectType: text("project_type").notNull(),
  challenge: text("challenge").notNull(),
  solution: text("solution").notNull(),
  results: text("results").notNull(),
  completedAt: timestamp("completed_at").notNull(),
  imageUrl: text("image_url"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});