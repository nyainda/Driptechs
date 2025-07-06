import { db } from "./db";
import { users, products, quotes, projects, blogPosts, contacts, teamMembers, successStories } from "@shared/schema";
import { eq, asc } from "drizzle-orm";
import { NotificationService } from "./notifications";
import type { 
  Product, Quote, Project, BlogPost, Contact, User,
  InsertProduct, InsertQuote, InsertProject, InsertBlogPost, InsertContact, InsertUser, TeamMember, InsertTeamMember,
  SuccessStory, InsertSuccessStory
} from "@shared/schema";

export class Storage {
  // User management
  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUser(id: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(id: string, updateData: Partial<InsertUser>): Promise<User> {
    const [user] = await db.update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Product management
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: string): Promise<Product | null> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || null;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(productData).returning();
    return product;
  }

  async updateProduct(id: string, updateData: Partial<InsertProduct>): Promise<Product> {
    const [product] = await db.update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Quote management
  async getQuotes(): Promise<Quote[]> {
    return await db.select().from(quotes);
  }

  async getQuote(id: string): Promise<Quote | null> {
    const [quote] = await db.select().from(quotes).where(eq(quotes.id, id));
    return quote || null;
  }

  async createQuote(quoteData: InsertQuote): Promise<Quote> {
    const [quote] = await db.insert(quotes).values(quoteData).returning();

    // Send notifications asynchronously
    NotificationService.sendQuoteEmail(quote);
    NotificationService.sendWhatsAppNotification(quote);

    return quote;
  }

  async sendQuoteToCustomer(quote: Quote): Promise<void> {
    await NotificationService.sendQuoteEmail(quote);
  }

  async updateQuote(id: string, updateData: Partial<InsertQuote>): Promise<Quote> {
    const [quote] = await db.update(quotes)
      .set(updateData)
      .where(eq(quotes.id, id))
      .returning();
    return quote;
  }

  async deleteQuote(id: string): Promise<void> {
    await db.delete(quotes).where(eq(quotes.id, id));
  }

  // Project management
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }

  async createProject(projectData: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(projectData).returning();
    return project;
  }

  // Blog management
  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || null;
  }

  async createBlogPost(postData: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db.insert(blogPosts).values(postData).returning();
    return post;
  }

  async updateBlogPost(id: string, updateData: Partial<InsertBlogPost>): Promise<BlogPost> {
    const [post] = await db.update(blogPosts)
      .set(updateData)
      .where(eq(blogPosts.id, id))
      .returning();
    return post;
  }

  async deleteBlogPost(id: string): Promise<void> {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  // Contact management
  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts);
  }

  async createContact(contactData: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values(contactData).returning();
    return contact;
  }

  // Team Members
  async getTeamMembers(): Promise<TeamMember[]> {
    return await db.select().from(teamMembers).orderBy(asc(teamMembers.order), asc(teamMembers.createdAt));
  }

  async createTeamMember(data: InsertTeamMember): Promise<TeamMember> {
    const [member] = await db.insert(teamMembers).values(data).returning();
    return member;
  }

  async updateTeamMember(id: string, data: Partial<InsertTeamMember>): Promise<TeamMember> {
    const [member] = await db.update(teamMembers)
      .set(data)
      .where(eq(teamMembers.id, id))
      .returning();
    return member;
  }

  async deleteTeamMember(id: string): Promise<void> {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
  }

  // Success Stories
  async getSuccessStories(): Promise<SuccessStory[]> {
    return await db.select().from(successStories).orderBy(asc(successStories.completedDate));
  }

  async createSuccessStory(data: InsertSuccessStory): Promise<SuccessStory> {
    const [story] = await db.insert(successStories).values(data).returning();
    return story;
  }

  async updateSuccessStory(id: string, data: Partial<InsertSuccessStory>): Promise<SuccessStory> {
    const [story] = await db.update(successStories)
      .set(data)
      .where(eq(successStories.id, id))
      .returning();
    return story;
  }

  async deleteSuccessStory(id: string): Promise<void> {
    await db.delete(successStories).where(eq(successStories.id, id));
  }
}

export const storage = new Storage();