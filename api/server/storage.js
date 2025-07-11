import { db } from "./db.js";
import { 
  users, products, quotes, projects, blogPosts, contacts, 
  teamMembers, successStories, pageViews, websiteAnalytics,
  achievements, userAchievements, gamificationStats
} from "../shared/schema.js";
import { eq, desc, sql, and, gte } from "drizzle-orm";
import bcrypt from "bcrypt";

export class Storage {
  constructor() {
    this.isInitialized = false;
  }

  private async isDemoMode() {
    return process.env.NODE_ENV !== 'production';
  }

  // Users
  async getUsers() {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  }

  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  }

  async createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        password: hashedPassword,
      })
      .returning();
    return user;
  }

  async updateUser(id, updateData) {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const [user] = await db
      .update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id) {
    await db.delete(users).where(eq(users.id, id));
  }

  // Products
  async getProducts() {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProduct(id) {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || null;
  }

  async getProductsByCategory(category) {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async createProduct(productData) {
    const [product] = await db
      .insert(products)
      .values(productData)
      .returning();
    return product;
  }

  async updateProduct(id, updateData) {
    const [product] = await db
      .update(products)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return product;
  }

  async deleteProduct(id) {
    await db.delete(products).where(eq(products.id, id));
  }

  // Quotes
  async getQuotes() {
    return await db.select().from(quotes).orderBy(desc(quotes.createdAt));
  }

  async getQuote(id) {
    const [quote] = await db.select().from(quotes).where(eq(quotes.id, id));
    return quote || null;
  }

  async createQuote(quoteData) {
    const [quote] = await db
      .insert(quotes)
      .values(quoteData)
      .returning();
    return quote;
  }

  async sendQuoteToCustomer(quote) {
    // This would integrate with email service
    console.log(\`Sending quote \${quote.id} to \${quote.customerEmail}\`);
  }

  async updateQuote(id, updateData) {
    const [quote] = await db
      .update(quotes)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(quotes.id, id))
      .returning();
    return quote;
  }

  async deleteQuote(id) {
    await db.delete(quotes).where(eq(quotes.id, id));
  }

  // Projects
  async getProjects() {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async createProject(projectData) {
    const [project] = await db
      .insert(projects)
      .values(projectData)
      .returning();
    return project;
  }

  // Blog Posts
  async getBlogPosts() {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPostBySlug(slug) {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post || null;
  }

  async createBlogPost(postData) {
    const [post] = await db
      .insert(blogPosts)
      .values(postData)
      .returning();
    return post;
  }

  async updateBlogPost(id, updateData) {
    const [post] = await db
      .update(blogPosts)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return post;
  }

  async deleteBlogPost(id) {
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
  }

  // Contacts
  async getContacts() {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async createContact(contactData) {
    const [contact] = await db
      .insert(contacts)
      .values(contactData)
      .returning();
    return contact;
  }

  // Team Members
  async getTeamMembers() {
    return await db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.active, true))
      .orderBy(teamMembers.name);
  }

  async createTeamMember(data) {
    const [member] = await db
      .insert(teamMembers)
      .values(data)
      .returning();
    return member;
  }

  async updateTeamMember(id, data) {
    const [member] = await db
      .update(teamMembers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(teamMembers.id, id))
      .returning();
    return member;
  }

  async deleteTeamMember(id) {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
  }

  // Success Stories
  async getSuccessStories() {
    return await db
      .select()
      .from(successStories)
      .where(eq(successStories.active, true))
      .orderBy(desc(successStories.createdAt));
  }

  async createSuccessStory(data) {
    const [story] = await db
      .insert(successStories)
      .values(data)
      .returning();
    return story;
  }

  async updateSuccessStory(id, data) {
    const [story] = await db
      .update(successStories)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(successStories.id, id))
      .returning();
    return story;
  }

  async deleteSuccessStory(id) {
    await db.delete(successStories).where(eq(successStories.id, id));
  }

  // Analytics
  async getAnalytics() {
    const today = new Date().toISOString().split('T')[0];
    const uniqueVisitorsToday = await this.getTodayUniqueVisitors();
    const visitorGrowth = await this.getVisitorGrowth();

    return {
      totalProducts: await db.select({ count: sql\`count(*)\` }).from(products),
      totalQuotes: await db.select({ count: sql\`count(*)\` }).from(quotes),
      totalProjects: await db.select({ count: sql\`count(*)\` }).from(projects),
      uniqueVisitorsToday,
      visitorGrowth,
      recentActivity: []
    };
  }

  async trackPageView(data) {
    await db.insert(pageViews).values({
      page: data.page,
      userAgent: data.userAgent,
      ipAddress: data.ipAddress,
      sessionId: data.sessionId,
    });
  }

  async getTodayUniqueVisitors() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const result = await db
      .select({ 
        count: sql\`COUNT(DISTINCT \${pageViews.sessionId})\`
      })
      .from(pageViews)
      .where(gte(pageViews.timestamp, today));
    
    return parseInt(result[0]?.count || '0');
  }

  async getVisitorGrowth() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);
    
    const [todayCount, yesterdayCount] = await Promise.all([
      db.select({ 
        count: sql\`COUNT(DISTINCT \${pageViews.sessionId})\`
      })
      .from(pageViews)
      .where(gte(pageViews.timestamp, todayStart)),
      
      db.select({ 
        count: sql\`COUNT(DISTINCT \${pageViews.sessionId})\`
      })
      .from(pageViews)
      .where(and(
        gte(pageViews.timestamp, yesterday),
        sql\`\${pageViews.timestamp} < \${todayStart}\`
      ))
    ]);
    
    const todayVisitors = parseInt(todayCount[0]?.count || '0');
    const yesterdayVisitors = parseInt(yesterdayCount[0]?.count || '0');
    
    if (yesterdayVisitors === 0) return 0;
    return Math.round(((todayVisitors - yesterdayVisitors) / yesterdayVisitors) * 100);
  }

  // Achievements
  async getAchievements() {
    return await db
      .select()
      .from(achievements)
      .where(eq(achievements.active, true))
      .orderBy(achievements.category, achievements.requirement);
  }

  async createAchievement(data) {
    const [achievement] = await db
      .insert(achievements)
      .values(data)
      .returning();
    return achievement;
  }

  async getUserAchievements(userId) {
    return await db
      .select({
        id: userAchievements.id,
        achievementId: userAchievements.achievementId,
        unlockedAt: userAchievements.unlockedAt,
        progress: userAchievements.progress,
        name: achievements.name,
        description: achievements.description,
        icon: achievements.icon,
        points: achievements.points,
        badge: achievements.badge,
      })
      .from(userAchievements)
      .innerJoin(achievements, eq(userAchievements.achievementId, achievements.id))
      .where(eq(userAchievements.userId, userId))
      .orderBy(desc(userAchievements.unlockedAt));
  }

  async unlockAchievement(userId, achievementId) {
    const [userAchievement] = await db
      .insert(userAchievements)
      .values({
        userId,
        achievementId,
        progress: 100,
      })
      .returning();
    return userAchievement;
  }

  async getGamificationStats(userId) {
    const [stats] = await db
      .select()
      .from(gamificationStats)
      .where(eq(gamificationStats.userId, userId));
    return stats || null;
  }

  async updateGamificationStats(userId) {
    const quotesCount = await db
      .select({ count: sql\`count(*)\` })
      .from(quotes);
    
    const projectsCount = await db
      .select({ count: sql\`count(*)\` })
      .from(projects);
    
    const achievementsCount = await db
      .select({ count: sql\`count(*)\` })
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId));

    const totalPoints = parseInt(quotesCount[0]?.count || '0') * 10 + 
                       parseInt(projectsCount[0]?.count || '0') * 25 +
                       parseInt(achievementsCount[0]?.count || '0') * 5;

    const level = Math.floor(totalPoints / 100) + 1;

    const [stats] = await db
      .insert(gamificationStats)
      .values({
        userId,
        totalPoints,
        level,
        quotesCreated: parseInt(quotesCount[0]?.count || '0'),
        projectsCompleted: parseInt(projectsCount[0]?.count || '0'),
        achievementsUnlocked: parseInt(achievementsCount[0]?.count || '0'),
        lastActive: new Date(),
      })
      .onConflictDoUpdate({
        target: gamificationStats.userId,
        set: {
          totalPoints,
          level,
          quotesCreated: parseInt(quotesCount[0]?.count || '0'),
          projectsCompleted: parseInt(projectsCount[0]?.count || '0'),
          achievementsUnlocked: parseInt(achievementsCount[0]?.count || '0'),
          lastActive: new Date(),
          updatedAt: new Date(),
        },
      })
      .returning();

    return stats;
  }

  async checkAndUnlockMilestones(userId) {
    const stats = await this.getGamificationStats(userId);
    if (!stats) return [];

    const allAchievements = await this.getAchievements();
    const userAchievements = await this.getUserAchievements(userId);
    const unlockedIds = new Set(userAchievements.map(ua => ua.achievementId));

    const newAchievements = [];
    
    for (const achievement of allAchievements) {
      if (unlockedIds.has(achievement.id)) continue;

      let shouldUnlock = false;

      switch (achievement.category) {
        case 'quotes':
          shouldUnlock = stats.quotesCreated >= achievement.requirement;
          break;
        case 'projects':
          shouldUnlock = stats.projectsCompleted >= achievement.requirement;
          break;
        case 'engagement':
          shouldUnlock = stats.totalPoints >= achievement.requirement;
          break;
      }

      if (shouldUnlock) {
        await this.unlockAchievement(userId, achievement.id);
        newAchievements.push(achievement);
      }
    }

    return newAchievements;
  }

  async initializeAdminUser() {
    try {
      const existingAdmin = await this.getUserByEmail('admin@driptech.co.ke');
      if (existingAdmin) {
        console.log('👤 Admin user already exists');
        return existingAdmin;
      }

      console.log('👤 Creating default admin user...');
      const adminUser = await this.createUser({
        email: 'admin@driptech.co.ke',
        password: 'admin123',
        name: 'System Administrator',
        role: 'super_admin',
        phone: '+254700000000'
      });

      console.log('✅ Default admin user created');
      return adminUser;
    } catch (error) {
      console.error('❌ Failed to create admin user:', error);
      throw error;
    }
  }

  async initializeDefaultAchievements() {
    try {
      const existingAchievements = await this.getAchievements();
      if (existingAchievements.length > 0) {
        console.log('✅ Default achievements already exist');
        return;
      }

      const defaultAchievements = [
        {
          name: 'First Quote',
          description: 'Create your first quote',
          icon: '🎯',
          type: 'milestone',
          requirement: 1,
          points: 10,
          badge: 'bronze',
          category: 'quotes'
        },
        {
          name: 'Quote Master',
          description: 'Create 10 quotes',
          icon: '🏆',
          type: 'milestone',
          requirement: 10,
          points: 50,
          badge: 'gold',
          category: 'quotes'
        },
        {
          name: 'Project Pioneer',
          description: 'Complete your first project',
          icon: '🚀',
          type: 'milestone',
          requirement: 1,
          points: 25,
          badge: 'silver',
          category: 'projects'
        }
      ];

      for (const achievement of defaultAchievements) {
        await this.createAchievement(achievement);
      }

      console.log('✅ Default achievements initialized');
    } catch (error) {
      console.error('❌ Failed to initialize achievements:', error);
    }
  }
}

export const storage = new Storage();