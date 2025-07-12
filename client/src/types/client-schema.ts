import { z } from "zod";

// Client-side type definitions without Drizzle ORM dependencies
export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  phone?: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  model: string;
  description: string;
  price: string;
  currency: string;
  images: string[];
  specifications: any;
  features: string[];
  applications: string[];
  inStock: boolean;
  stockQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quote {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  projectType: string;
  areaSize: string;
  cropType?: string;
  location: string;
  waterSource?: string;
  distanceToFarm?: string;
  numberOfBeds?: number;
  soilType?: string;
  budgetRange?: string;
  timeline?: string;
  requirements?: string;
  status: string;
  totalAmount?: string;
  vatAmount?: string;
  finalTotal?: string;
  currency: string;
  items: any[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  location: string;
  areaSize: string;
  cropType: string;
  systemType: string;
  completionDate: Date;
  clientName: string;
  images: string[];
  features: string[];
  challenges: string[];
  solutions: string[];
  results: string[];
  createdAt: Date;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  tags: string[];
  imageUrl?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  createdAt: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  email: string;
  phone?: string;
  bio: string;
  image?: string;
  active: boolean;
  createdAt: Date;
}

export interface SuccessStory {
  id: string;
  title: string;
  description: string;
  clientName: string;
  location: string;
  challenge: string;
  solution: string;
  results: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface PageView {
  id: string;
  page: string;
  userAgent: string;
  ipAddress: string;
  sessionId: string;
  timestamp: Date;
}

export interface WebsiteAnalytics {
  id: string;
  totalVisitors: number;
  uniqueVisitors: number;
  pageViews: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: any;
  trafficSources: any;
  deviceTypes: any;
  date: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  badgeIcon: string;
  badgeColor: string;
  pointsRequired: number;
  category: string;
  isActive: boolean;
  createdAt: Date;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
}

export interface GamificationStats {
  id: string;
  userId: string;
  totalPoints: number;
  level: number;
  achievementsUnlocked: number;
  quotesCompleted: number;
  projectsViewed: number;
  blogPostsRead: number;
  lastActivityAt: Date;
}

// Client-side validation schemas
export const insertUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.string().default("user"),
  phone: z.string().optional(),
});

export const insertProductSchema = z.object({
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
  numberOfBeds: z.number().optional(),
  soilType: z.string().optional(),
  budgetRange: z.string().optional(),
  timeline: z.string().optional(),
  requirements: z.string().optional(),
  status: z.string().default("pending"),
  totalAmount: z.string().optional(),
  vatAmount: z.string().optional(),
  finalTotal: z.string().optional(),
  currency: z.string().default("KSH"),
  items: z.array(z.any()).default([]),
  notes: z.string().optional(),
});

export const insertProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  location: z.string().min(1),
  areaSize: z.string().min(1),
  cropType: z.string().min(1),
  systemType: z.string().min(1),
  completionDate: z.date(),
  clientName: z.string().min(1),
  images: z.array(z.string()).default([]),
  features: z.array(z.string()).default([]),
  challenges: z.array(z.string()).default([]),
  solutions: z.array(z.string()).default([]),
  results: z.array(z.string()).default([]),
});

export const insertBlogPostSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().min(1),
  author: z.string().min(1),
  tags: z.array(z.string()).default([]),
  imageUrl: z.string().optional(),
  published: z.boolean().default(false),
});

export const insertContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  subject: z.string().min(1),
  message: z.string().min(1),
  status: z.string().default("pending"),
});

export const insertTeamMemberSchema = z.object({
  name: z.string().min(1),
  position: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  bio: z.string().min(1),
  image: z.string().optional(),
  active: z.boolean().default(true),
});

export const insertSuccessStorySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  clientName: z.string().min(1),
  location: z.string().min(1),
  challenge: z.string().min(1),
  solution: z.string().min(1),
  results: z.string().min(1),
  imageUrl: z.string().optional(),
});

export const insertPageViewSchema = z.object({
  page: z.string().min(1),
  userAgent: z.string().min(1),
  ipAddress: z.string().min(1),
  sessionId: z.string().min(1),
});

export const insertWebsiteAnalyticsSchema = z.object({
  totalVisitors: z.number().min(0),
  uniqueVisitors: z.number().min(0),
  pageViews: z.number().min(0),
  bounceRate: z.number().min(0),
  avgSessionDuration: z.number().min(0),
  topPages: z.any(),
  trafficSources: z.any(),
  deviceTypes: z.any(),
  date: z.date(),
});

export const insertAchievementSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  badgeIcon: z.string().min(1),
  badgeColor: z.string().min(1),
  pointsRequired: z.number().min(0),
  category: z.string().min(1),
  isActive: z.boolean().default(true),
});

export const insertUserAchievementSchema = z.object({
  userId: z.string().min(1),
  achievementId: z.string().min(1),
});

export const insertGamificationStatsSchema = z.object({
  userId: z.string().min(1),
  totalPoints: z.number().min(0),
  level: z.number().min(1),
  achievementsUnlocked: z.number().min(0),
  quotesCompleted: z.number().min(0),
  projectsViewed: z.number().min(0),
  blogPostsRead: z.number().min(0),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
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

// Type exports for convenience
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type InsertSuccessStory = z.infer<typeof insertSuccessStorySchema>;
export type InsertPageView = z.infer<typeof insertPageViewSchema>;
export type InsertWebsiteAnalytics = z.infer<typeof insertWebsiteAnalyticsSchema>;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type InsertGamificationStats = z.infer<typeof insertGamificationStatsSchema>;
export type LoginData = z.infer<typeof loginSchema>;