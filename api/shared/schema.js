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
  photoUrl: text("photo_url"),
  image: text("image"),
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
  projectType: text("project_type").notNull(),
  areaSize: text("area_size").notNull(),
  location: text("location").notNull(),
  challenge: text("challenge").notNull(),
  solution: text("solution").notNull(),
  results: text("results").notNull(),
  image: text("image"),
  clientTestimonial: text("client_testimonial"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const pageViews = pgTable("page_views", {
  id: uuid("id").primaryKey().defaultRandom(),
  page: text("page").notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  sessionId: text("session_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const websiteAnalytics = pgTable("website_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  metric: text("metric").notNull(),
  value: integer("value").notNull(),
  date: timestamp("date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  category: text("category").notNull(),
  points: integer("points").notNull().default(0),
  requirement: jsonb("requirement").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userAchievements = pgTable("user_achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  achievementId: uuid("achievement_id").references(() => achievements.id),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  progress: jsonb("progress").default({}),
});

export const gamificationStats = pgTable("gamification_stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  totalPoints: integer("total_points").default(0),
  level: integer("level").default(1),
  streak: integer("streak").default(0),
  lastActivityAt: timestamp("last_activity_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  name: true,
  role: true,
  phone: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSuccessStorySchema = createInsertSchema(successStories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPageViewSchema = createInsertSchema(pageViews).omit({
  id: true,
  createdAt: true,
});

export const insertWebsiteAnalyticsSchema = createInsertSchema(websiteAnalytics).omit({
  id: true,
  createdAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  unlockedAt: true,
});

export const insertGamificationStatsSchema = createInsertSchema(gamificationStats).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const insertProductSchema1 = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  model: z.string().min(1),
  description: z.string().min(1),
  price: z.string().min(1),
  currency: z.string().default("KSH"),
  images: z.array(z.string()).default([]),
  specifications: z.any(),
  features: z.array(z.string()).default([]),
  applications: z.array(z.string()).default([]),
  inStock: z.boolean().default(true),
  stockQuantity: z.number().default(0),
});

export const productSchema = insertProductSchema1.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});