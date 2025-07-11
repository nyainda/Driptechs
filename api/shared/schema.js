import { pgTable, text, serial, integer, boolean, decimal, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";
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
  clientName: text("client_name").notNull(),
  clientContact: text("client_contact"),
  equipment: text("equipment").array().default([]),
  challenges: text("challenges"),
  solutions: text("solutions"),
  results: text("results"),
  featured: boolean("featured").default(false),
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
  author: text("author").notNull(),
  featuredImage: text("featured_image"),
  published: boolean("published").default(false),
  publishedAt: timestamp("published_at"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  readTime: integer("read_time"),
  views: integer("views").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  source: text("source").default("website"), // website, phone, email, referral
  status: text("status").default("new"), // new, contacted, qualified, converted, closed
  priority: text("priority").default("medium"), // low, medium, high, urgent
  assignedTo: uuid("assigned_to").references(() => users.id),
  followUpDate: timestamp("follow_up_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const teamMembers = pgTable("team_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  department: text("department").notNull(),
  bio: text("bio").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  image: text("image"),
  linkedin: text("linkedin"),
  experience: text("experience"),
  specialties: text("specialties").array().default([]),
  active: boolean("active").default(true),
  joinDate: timestamp("join_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const successStories = pgTable("success_stories", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  clientName: text("client_name").notNull(),
  location: text("location").notNull(),
  projectType: text("project_type").notNull(),
  challenge: text("challenge").notNull(),
  solution: text("solution").notNull(),
  results: text("results").notNull(),
  metrics: jsonb("metrics").default({}), // JSON object with key metrics
  testimonial: text("testimonial"),
  images: text("images").array().default([]),
  featured: boolean("featured").default(false),
  active: boolean("active").default(true),
  timestamp: timestamp("timestamp").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const pageViews = pgTable("page_views", {
  id: uuid("id").primaryKey().defaultRandom(),
  page: text("page").notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  sessionId: text("session_id"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const websiteAnalytics = pgTable("website_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: text("date").notNull(), // YYYY-MM-DD format
  uniqueVisitors: integer("unique_visitors").default(0),
  pageViews: integer("page_views").default(0),
  sessionDuration: integer("session_duration").default(0), // in seconds
  bounceRate: decimal("bounce_rate", { precision: 5, scale: 2 }).default("0"),
  topPages: jsonb("top_pages").default([]),
  referrers: jsonb("referrers").default([]),
  devices: jsonb("devices").default({}),
  browsers: jsonb("browsers").default({}),
  locations: jsonb("locations").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  type: text("type").notNull(), // milestone, action, streak
  requirement: integer("requirement").notNull(), // e.g., 10 for "10 quotes created"
  points: integer("points").default(0),
  badge: text("badge"), // color or image reference
  category: text("category").notNull(), // quotes, projects, engagement
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userAchievements = pgTable("user_achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  achievementId: uuid("achievement_id").notNull().references(() => achievements.id),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  progress: integer("progress").default(0),
});

export const gamificationStats = pgTable("gamification_stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id).unique(),
  totalPoints: integer("total_points").default(0),
  level: integer("level").default(1),
  quotesCreated: integer("quotes_created").default(0),
  projectsCompleted: integer("projects_completed").default(0),
  achievementsUnlocked: integer("achievements_unlocked").default(0),
  streak: integer("streak").default(0), // consecutive days active
  lastActive: timestamp("last_active").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Validation schemas
export const insertUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(["user", "admin", "super_admin"]).default("user"),
  phone: z.string().optional(),
});

export const insertProductSchema = z.object({
  name: z.string().min(1),
  category: z.enum(["drip_irrigation", "sprinkler", "filtration", "control", "fertigation", "accessories"]),
  model: z.string().min(1),
  description: z.string().min(1),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
  currency: z.string().default("KSH"),
  images: z.array(z.string()).default([]),
  specifications: z.record(z.any()),
  features: z.array(z.string()).default([]),
  applications: z.array(z.string()).default([]),
  inStock: z.boolean().default(true),
  stockQuantity: z.number().int().min(0).default(0),
});

export const insertQuoteSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(1),
  projectType: z.string().min(1),
  areaSize: z.string().min(1),
  cropType: z.string().optional(),
  location: z.string().min(1),
  waterSource: z.string().optional(),
  distanceToFarm: z.string().optional(),
  numberOfBeds: z.number().int().positive().optional(),
  soilType: z.string().optional(),
  budgetRange: z.string().optional(),
  timeline: z.string().optional(),
  requirements: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed", "cancelled", "sent"]).default("pending"),
  totalAmount: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  vatAmount: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  finalTotal: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  currency: z.string().default("KSH"),
  items: z.array(z.any()).default([]),
  notes: z.string().optional(),
  assignedTo: z.string().uuid().optional(),
  deliveryMethod: z.enum(["email", "whatsapp", "sms"]).default("email"),
});

export const insertContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(1),
  source: z.string().default("website"),
  status: z.string().default("new"),
  priority: z.string().default("medium"),
});

export const insertBlogPostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
  author: z.string().min(1),
  featuredImage: z.string().optional(),
  published: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  readTime: z.number().int().positive().optional(),
});

export const insertProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  projectType: z.string().min(1),
  areaSize: z.string().min(1),
  value: z.string().regex(/^\d+(\.\d{1,2})?$/),
  currency: z.string().default("KSH"),
  status: z.enum(["planning", "in_progress", "completed", "on_hold"]).default("planning"),
  clientName: z.string().min(1),
  clientContact: z.string().optional(),
  equipment: z.array(z.string()).default([]),
  challenges: z.string().optional(),
  solutions: z.string().optional(),
  results: z.string().optional(),
  featured: z.boolean().default(false),
});

export const insertTeamMemberSchema = z.object({
  name: z.string().min(1),
  position: z.string().min(1),
  department: z.string().min(1),
  bio: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  image: z.string().optional(),
  linkedin: z.string().optional(),
  experience: z.string().optional(),
  specialties: z.array(z.string()).default([]),
  active: z.boolean().default(true),
});

export const insertSuccessStorySchema = z.object({
  title: z.string().min(1),
  clientName: z.string().min(1),
  location: z.string().min(1),
  projectType: z.string().min(1),
  challenge: z.string().min(1),
  solution: z.string().min(1),
  results: z.string().min(1),
  metrics: z.record(z.any()).default({}),
  testimonial: z.string().optional(),
  images: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});