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
  currency: text("currency").notNull().default("KSH"),
  items: jsonb("items").default([]), // Array of quote items
  notes: text("notes"),
  assignedTo: integer("assigned_to").references(() => users.id),
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
  clientId: integer("client_id").references(() => users.id),
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
  authorId: integer("author_id").references(() => users.id),
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

// Schema validation
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

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

// Product schema
export const insertProductSchema1 = z.object({
  name: z.string().min(1, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.number().min(0, "Price must be positive"),
  description: z.string().optional(),
  image_url: z.string().optional(),
  specifications: z.string().optional(),
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
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type LoginData = z.infer<typeof loginSchema>;