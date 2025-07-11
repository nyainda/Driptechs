// Quick fix for Vercel deployment
// This file contains the corrected schema definitions that match the database structure

import { z } from 'zod';

// Fixed schema validation to match database structure
export const insertUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  phone: z.string().optional(),
});

export const insertQuoteSchema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  projectType: z.string().min(1),
  location: z.string().min(1),
  area: z.number().min(0),
  items: z.array(z.any()).default([]),
  totalAmount: z.number().min(0),
  status: z.enum(['pending', 'approved', 'rejected', 'completed', 'sent']).default('pending'),
  notes: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const insertProductSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  model: z.string().min(1),
  price: z.number().min(0),
  description: z.string().min(1),
  images: z.array(z.string()).default([]),
  specifications: z.record(z.any()).default({}),
  features: z.array(z.string()).default([]),
  applications: z.array(z.string()).default([]),
  inStock: z.boolean().default(true),
  stockQuantity: z.number().min(0).default(0),
});

export const insertContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(1),
});

export const insertTeamMemberSchema = z.object({
  name: z.string().min(1),
  position: z.string().min(1),
  bio: z.string().min(1),
  image: z.string().optional(),
  email: z.string().email().optional(),
  linkedin: z.string().optional(),
  active: z.boolean().default(true),
});

export const insertBlogPostSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  excerpt: z.string().min(1),
  slug: z.string().min(1),
  author: z.string().min(1),
  published: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  featuredImage: z.string().optional(),
});

export const insertSuccessStorySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  customerName: z.string().min(1),
  location: z.string().min(1),
  image: z.string().optional(),
  results: z.array(z.string()).default([]),
  category: z.string().min(1),
});

export const insertProjectSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  images: z.array(z.string()).default([]),
  location: z.string().min(1),
  area: z.number().min(0),
  completedDate: z.string().optional(),
  features: z.array(z.string()).default([]),
  category: z.string().min(1),
});

export const insertPageViewSchema = z.object({
  page: z.string().min(1),
  userAgent: z.string().optional(),
  ipAddress: z.string().optional(),
  sessionId: z.string().min(1),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type InsertSuccessStory = z.infer<typeof insertSuccessStorySchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertPageView = z.infer<typeof insertPageViewSchema>;