import { pgTable, text, serial, integer, boolean, decimal, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("user"), // user, admin, super_admin
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  category: text("category").notNull(), // drip_irrigation, sprinkler, filtration, control, fertigation, accessories
  model: text("model").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("KSH"),
  images: text("images").array().default([]),
  specifications: jsonb("specifications").notNull(), // Technical specs as JSON
  features: text("features").array().default([]),
  applications: text("applications").array().default([]),
  inStock: boolean("in_stock").default(true),
  stockQuantity: integer("stock_quantity").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const quotes = pgTable("quotes", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  projectType: text("project_type").notNull(),
  areaSize: text("area_size").notNull(),
  cropType: text("crop_type"),
  location: text("location").notNull(),
  waterSource: text("water_source"),
  distanceToFarm: text("distance_to_farm"),
  numberOfBeds: integer("number_of_beds"),
  soilType: text("soil_type"),
  budgetRange: text("budget_range"),
  timeline: text("timeline"),
  requirements: text("requirements"),
  status: text("status").notNull().default("pending"), // pending, in_progress, completed, cancelled, sent
  totalAmount: decimal("total_amount", { precision: 12, scale: 2 }),
  vatAmount: decimal("vat_amount", { precision: 12, scale: 2 }),
  finalTotal: decimal("final_total", { precision: 12, scale: 2 }),
  currency: text("currency").notNull().default("KSH"),
  items: jsonb("items").default([]), // Array of quote items
  notes: text("notes"),
  assignedTo: uuid("assigned_to").references(() => users.id),
  sentAt: timestamp("sent_at"),
  deliveryMethod: text("delivery_method").default("email"), // email, whatsapp, sms
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  projectType: text("project_type").notNull(),
  areaSize: text("area_size").notNull(),
  value: decimal("value", { precision: 12, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("KSH"),
  status: text("status").notNull().default("planning"), // planning, in_progress, completed, on_hold
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  images: text("images").array().default([]),
  results: jsonb("results"), // Performance metrics, savings, etc.
  clientId: uuid("client_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array().default([]),
  featuredImage: text("featured_image"),
  published: boolean("published").default(false),
  authorId: uuid("author_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"), // new, replied, closed
  createdAt: timestamp("created_at").defaultNow(),
});

export const teamMembers = pgTable("team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  bio: text("bio").notNull(),
  photoUrl: text("photo_url"), // New field for photo URL
  image: text("image"), // Keep for backward compatibility
  email: text("email"),
  linkedin: text("linkedin"),
  order: integer("order").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const successStories = pgTable("success_stories", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  clientName: text("client_name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull().default("Agriculture"),
  location: text("location").notNull(),
  areaSize: text("area_size").notNull(),
  waterSavings: text("water_savings"),
  yieldIncrease: text("yield_increase"),
  photoUrl: text("photo_url"), // New field for photo URL
  image: text("image"), // Keep for backward compatibility
  completedDate: text("completed_date").notNull(),
  featured: boolean("featured").default(false),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Website analytics tracking
export const pageViews = pgTable("page_views", {
  id: uuid("id").primaryKey().defaultRandom(),
  page: text("page").notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  sessionId: text("session_id").notNull(),
  referrer: text("referrer"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const websiteAnalytics = pgTable("website_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: text("date").notNull().unique(), // YYYY-MM-DD format
  totalVisitors: integer("total_visitors").default(0),
  uniqueVisitors: integer("unique_visitors").default(0),
  pageViews: integer("page_views").default(0),
  bounceRate: decimal("bounce_rate", { precision: 5, scale: 2 }).default("0"),
  avgSessionDuration: integer("avg_session_duration").default(0), // in seconds
  topPages: jsonb("top_pages").default([]),
  trafficSources: jsonb("traffic_sources").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Achievement badges system
export const achievements = pgTable("achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  category: text("category").notNull(), // visitors, quotes, revenue, content, engagement
  milestone: integer("milestone").notNull(),
  color: text("color").notNull().default("blue"),
  rarity: text("rarity").notNull().default("common"), // common, rare, epic, legendary
  createdAt: timestamp("created_at").defaultNow(),
});

export const userAchievements = pgTable("user_achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  achievementId: uuid("achievement_id").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  progress: integer("progress").default(0),
  completed: boolean("completed").default(false),
});

// Gamification stats
export const gamificationStats = pgTable("gamification_stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().unique(),
  totalPoints: integer("total_points").default(0),
  level: integer("level").default(1),
  experiencePoints: integer("experience_points").default(0),
  achievementCount: integer("achievement_count").default(0),
  streak: integer("streak").default(0), // consecutive days of activity
  lastActivity: timestamp("last_activity").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schema validation - simplified for Vercel compatibility
export const insertUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(['user', 'admin', 'super_admin']).default('user'),
  phone: z.string().optional(),
});

// All other schema definitions have been moved to schema-validation for Vercel compatibility

export const insertUserAchievementSchema = z.object({
  userId: z.string().min(1),
  achievementId: z.string().min(1),
  progress: z.number().min(0).default(0),
  completed: z.boolean().default(false),
});

export const insertGamificationStatsSchema = z.object({
  userId: z.string().min(1),
  totalPoints: z.number().min(0).default(0),
  level: z.number().min(1).default(1),
  experiencePoints: z.number().min(0).default(0),
  achievementCount: z.number().min(0).default(0),
  streak: z.number().min(0).default(0),
  lastActivity: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Product schema
export const insertProductSchema1 = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  model: z.string().min(1, "Model is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  images: z.array(z.string()).optional().default([]),
  specifications: z.record(z.any()).optional().default({}),
  features: z.array(z.string()).optional().default([]),
  applications: z.array(z.string()).optional().default([]),
  inStock: z.boolean().optional().default(true),
  stockQuantity: z.number().min(0).optional().default(0),
});

export const productSchema = insertProductSchema1.extend({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema1>;
export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = any;
export type Project = typeof projects.$inferSelect;
export type InsertProject = any;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = any;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = any;
export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = any;
export type SuccessStory = typeof successStories.$inferSelect;
export type InsertSuccessStory = any;
export type PageView = typeof pageViews.$inferSelect;
export type InsertPageView = any;
export type WebsiteAnalytics = typeof websiteAnalytics.$inferSelect;
export type InsertWebsiteAnalytics = any;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = any;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type GamificationStats = typeof gamificationStats.$inferSelect;
export type InsertGamificationStats = z.infer<typeof insertGamificationStatsSchema>;
export type LoginData = z.infer<typeof loginSchema>;