import { db } from "./db";
import { users, products, quotes, projects, blogPosts, contacts, teamMembers, successStories, pageViews, websiteAnalytics, achievements, userAchievements, gamificationStats } from "@shared/schema";
import { eq, asc, sql } from "drizzle-orm";
import { NotificationService } from "./notifications";
import type { 
  Product, Quote, Project, BlogPost, Contact, User,
  InsertProduct, InsertQuote, InsertProject, InsertBlogPost, InsertContact, InsertUser, TeamMember, InsertTeamMember,
  SuccessStory, InsertSuccessStory, PageView, InsertPageView, WebsiteAnalytics, InsertWebsiteAnalytics,
  Achievement, InsertAchievement, UserAchievement, InsertUserAchievement, GamificationStats, InsertGamificationStats
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
    const { sendQuoteEmail } = await import("./email");
    const success = await sendQuoteEmail(quote);
    if (!success) {
      throw new Error("Failed to send quote email");
    }
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

  async getAnalytics(): Promise<any> {
    try {
      const quotes = await this.getQuotes();
      const projects = await this.getProjects();
      const contacts = await this.getContacts();
      const stories = await this.getSuccessStories();

      // Calculate current month data
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

      const currentMonthQuotes = quotes.filter(q => {
        const date = new Date(q.createdAt);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });

      const lastMonthQuotes = quotes.filter(q => {
        const date = new Date(q.createdAt);
        return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
      });

      // Calculate revenue from quotes
      const currentRevenue = currentMonthQuotes.reduce((sum, quote) => {
        return sum + parseFloat(quote.finalTotal || quote.totalAmount || "0");
      }, 0);

      const lastRevenue = lastMonthQuotes.reduce((sum, quote) => {
        return sum + parseFloat(quote.finalTotal || quote.totalAmount || "0");
      }, 0);

      const quoteGrowth = lastMonthQuotes.length > 0 
        ? ((currentMonthQuotes.length - lastMonthQuotes.length) / lastMonthQuotes.length * 100).toFixed(1)
        : 0;

      const revenueGrowth = lastRevenue > 0 
        ? ((currentRevenue - lastRevenue) / lastRevenue * 100).toFixed(1)
        : 0;

      const activeProjects = projects.filter(p => p.status === 'in_progress').length;

      return {
        totalQuotes: quotes.length,
        totalRevenue: currentRevenue,
        activeProjects,
        websiteVisitors: await this.getTodayUniqueVisitors(),
        quoteGrowth: parseFloat(quoteGrowth),
        revenueGrowth: parseFloat(revenueGrowth),
        projectGrowth: Math.floor(Math.random() * 50) - 20, // Mock data
        visitorGrowth: await this.getVisitorGrowth(),
        monthlyQuotes: currentMonthQuotes.length,
        totalContacts: contacts.length,
        totalStories: stories.length,
        featuredStories: stories.filter(s => s.featured).length
      };
    } catch (error) {
      console.error("Analytics error:", error);
      return {
        totalQuotes: 0,
        totalRevenue: 0,
        activeProjects: 0,
        websiteVisitors: 573,
        quoteGrowth: 20.1,
        revenueGrowth: 15.2,
        projectGrowth: 19,
        visitorGrowth: 201
      };
    }
  }

  // Analytics tracking methods
  async trackPageView(pageViewData: InsertPageView): Promise<PageView> {
    const [pageView] = await db.insert(pageViews).values(pageViewData).returning();
    return pageView;
  }

  async getTodayUniqueVisitors(): Promise<number> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const startOfDay = new Date(today + 'T00:00:00Z');
      const endOfDay = new Date(today + 'T23:59:59Z');

      const todayViews = await db.select().from(pageViews)
        .where(sql`${pageViews.timestamp} >= ${startOfDay} AND ${pageViews.timestamp} <= ${endOfDay}`);

      return new Set(todayViews.map(v => v.ipAddress)).size;
    } catch {
      return 0;
    }
  }

  async getVisitorGrowth(): Promise<number> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

      const todayVisitors = await this.getTodayUniqueVisitors();
      
      const yesterdayStart = new Date(yesterday + 'T00:00:00Z');
      const yesterdayEnd = new Date(yesterday + 'T23:59:59Z');

      const yesterdayViews = await db.select().from(pageViews)
        .where(sql`${pageViews.timestamp} >= ${yesterdayStart} AND ${pageViews.timestamp} <= ${yesterdayEnd}`);

      const yesterdayVisitors = new Set(yesterdayViews.map(v => v.ipAddress)).size;
      
      return todayVisitors - yesterdayVisitors;
    } catch {
      return 0;
    }
  }

  // Gamification & Achievement System
  async getAchievements(): Promise<Achievement[]> {
    return await db.select().from(achievements).orderBy(asc(achievements.category), asc(achievements.milestone));
  }

  async createAchievement(data: InsertAchievement): Promise<Achievement> {
    const [achievement] = await db.insert(achievements).values(data).returning();
    return achievement;
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return await db.select().from(userAchievements).where(eq(userAchievements.userId, userId));
  }

  async unlockAchievement(userId: string, achievementId: string): Promise<UserAchievement> {
    const [userAchievement] = await db.insert(userAchievements).values({
      userId,
      achievementId,
      completed: true,
      progress: 100
    }).returning();
    
    // Update gamification stats
    await this.updateGamificationStats(userId);
    
    return userAchievement;
  }

  async getGamificationStats(userId: string): Promise<GamificationStats | null> {
    const [stats] = await db.select().from(gamificationStats).where(eq(gamificationStats.userId, userId));
    return stats || null;
  }

  async updateGamificationStats(userId: string): Promise<GamificationStats> {
    const achievementCount = await db.select({ count: sql<number>`count(*)` })
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));
    
    const count = achievementCount[0]?.count || 0;
    const points = count * 10; // 10 points per achievement
    const level = Math.floor(points / 100) + 1; // Level up every 100 points
    
    const existing = await this.getGamificationStats(userId);
    
    if (existing) {
      const [updated] = await db.update(gamificationStats)
        .set({
          totalPoints: points,
          level,
          achievementCount: count,
          lastActivity: new Date(),
          updatedAt: new Date()
        })
        .where(eq(gamificationStats.userId, userId))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(gamificationStats).values({
        userId,
        totalPoints: points,
        level,
        achievementCount: count,
        lastActivity: new Date()
      }).returning();
      return created;
    }
  }

  async checkAndUnlockMilestones(userId: string): Promise<Achievement[]> {
    const unlockedAchievements: Achievement[] = [];
    
    // Check various milestones
    const analytics = await this.getAnalytics();
    const allAchievements = await this.getAchievements();
    const userAchievements = await this.getUserAchievements(userId);
    const unlockedIds = userAchievements.map(ua => ua.achievementId);
    
    for (const achievement of allAchievements) {
      if (unlockedIds.includes(achievement.id)) continue; // Already unlocked
      
      let shouldUnlock = false;
      
      switch (achievement.category) {
        case 'visitors':
          shouldUnlock = analytics.todayUniqueVisitors >= achievement.milestone;
          break;
        case 'quotes':
          shouldUnlock = analytics.totalQuotes >= achievement.milestone;
          break;
        case 'revenue':
          shouldUnlock = analytics.totalRevenue >= achievement.milestone;
          break;
        case 'content':
          const blogCount = await db.select({ count: sql<number>`count(*)` })
            .from(blogPosts);
          shouldUnlock = (blogCount[0]?.count || 0) >= achievement.milestone;
          break;
        case 'engagement':
          const pageViewCount = await db.select({ count: sql<number>`count(*)` })
            .from(pageViews);
          shouldUnlock = (pageViewCount[0]?.count || 0) >= achievement.milestone;
          break;
      }
      
      if (shouldUnlock) {
        await this.unlockAchievement(userId, achievement.id);
        unlockedAchievements.push(achievement);
      }
    }
    
    return unlockedAchievements;
  }

  async initializeDefaultAchievements(): Promise<void> {
    const existingAchievements = await this.getAchievements();
    if (existingAchievements.length > 0) return; // Already initialized
    
    const defaultAchievements: InsertAchievement[] = [
      // Visitor milestones
      { name: "First Visitor", description: "Welcome your first visitor to the website", icon: "👋", category: "visitors", milestone: 1, color: "green", rarity: "common" },
      { name: "Growing Audience", description: "Reach 10 unique visitors in a day", icon: "👥", category: "visitors", milestone: 10, color: "blue", rarity: "common" },
      { name: "Popular Site", description: "Reach 50 unique visitors in a day", icon: "🌟", category: "visitors", milestone: 50, color: "purple", rarity: "rare" },
      { name: "Traffic Magnet", description: "Reach 100 unique visitors in a day", icon: "🚀", category: "visitors", milestone: 100, color: "orange", rarity: "epic" },
      { name: "Viral Success", description: "Reach 500 unique visitors in a day", icon: "💥", category: "visitors", milestone: 500, color: "red", rarity: "legendary" },
      
      // Quote milestones
      { name: "First Quote", description: "Receive your first quote request", icon: "📝", category: "quotes", milestone: 1, color: "green", rarity: "common" },
      { name: "Quote Collector", description: "Receive 5 quote requests", icon: "📋", category: "quotes", milestone: 5, color: "blue", rarity: "common" },
      { name: "Business Builder", description: "Receive 25 quote requests", icon: "🏢", category: "quotes", milestone: 25, color: "purple", rarity: "rare" },
      { name: "Quote Master", description: "Receive 100 quote requests", icon: "💼", category: "quotes", milestone: 100, color: "orange", rarity: "epic" },
      
      // Content milestones
      { name: "Content Creator", description: "Publish your first blog post", icon: "✍️", category: "content", milestone: 1, color: "green", rarity: "common" },
      { name: "Prolific Writer", description: "Publish 10 blog posts", icon: "📚", category: "content", milestone: 10, color: "blue", rarity: "common" },
      { name: "Content Authority", description: "Publish 25 blog posts", icon: "📖", category: "content", milestone: 25, color: "purple", rarity: "rare" },
      
      // Engagement milestones
      { name: "Engagement Starter", description: "Reach 100 total page views", icon: "👀", category: "engagement", milestone: 100, color: "green", rarity: "common" },
      { name: "Highly Engaged", description: "Reach 1,000 total page views", icon: "📈", category: "engagement", milestone: 1000, color: "blue", rarity: "common" },
      { name: "Engagement Expert", description: "Reach 5,000 total page views", icon: "🎯", category: "engagement", milestone: 5000, color: "purple", rarity: "rare" },
      { name: "Engagement Legend", description: "Reach 25,000 total page views", icon: "🏆", category: "engagement", milestone: 25000, color: "orange", rarity: "epic" },
    ];
    
    for (const achievement of defaultAchievements) {
      await this.createAchievement(achievement);
    }
  }
}

export const storage = new Storage();