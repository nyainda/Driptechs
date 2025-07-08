import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProductSchema, insertQuoteSchema, insertProjectSchema, 
  insertBlogPostSchema, insertContactSchema, insertTeamMemberSchema, 
  insertSuccessStorySchema, loginSchema, insertUserSchema 
} from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sql } from 'drizzle-orm';
import { sendQuoteEmail } from "./email";
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Authentication middleware
const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Admin middleware
const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user.role !== "admin" && req.user.role !== "super_admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {


  // Health check endpoint to keep database alive
app.get("/api/health", async (req, res) => {
  try {
    // Simple query to keep database connection alive
    await storage.getUsers?.(); // Or use another lightweight query like getProducts()
    res.json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected',
      message: 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  }
});
  
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ 
          message: "Account not found", 
          details: "No account exists with this email address. Please check your email or contact support.",
          field: "email"
        });
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ 
          message: "Incorrect password", 
          details: "The password you entered is incorrect. Please try again or reset your password.",
          field: "password"
        });
      }
      
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "7d" }
      );
      
      res.json({ 
        token, 
        user: { id: user.id, email: user.email, name: user.name, role: user.role } 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ 
        message: "Login failed", 
        details: "Invalid email or password format. Please check your input and try again."
      });
    }
  });

  app.get("/api/auth/me", authenticate, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Public product routes
  app.get("/api/products", async (req, res) => {
    try {
      const category = req.query.category as string;
      const products = category 
        ? await storage.getProductsByCategory(category)
        : await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Admin product routes
  app.post("/api/admin/products", authenticate, requireAdmin, async (req, res) => {
    try {
      console.log("Creating product with data:", req.body);
      
      // Transform data to match database schema
      const transformedData = {
        ...req.body,
        price: req.body.price?.toString(), // Convert number to string for decimal
        specifications: req.body.specifications || {},
        features: req.body.features || [],
        applications: req.body.applications || [],
        images: req.body.images || [],
      };
      
      const productData = insertProductSchema.parse(transformedData);
      const product = await storage.createProduct(productData);
      res.json(product);
    } catch (error: any) {
      console.error("Product creation error:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Invalid product data", 
          details: error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', '),
          errors: error.errors
        });
      }
      res.status(400).json({ message: "Invalid product data", details: error.message });
    }
  });

  app.put("/api/admin/products/:id", authenticate, requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      const updateData = req.body;
      const product = await storage.updateProduct(id, updateData);
      res.json(product);
    } catch (error) {
      res.status(400).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/admin/products/:id", authenticate, requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      await storage.deleteProduct(id);
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // User management routes
  app.get("/api/admin/users", authenticate, requireAdmin, async (req, res) => {
    try {
      const users = await storage.getUsers();
      // Remove passwords from response
      const safeUsers = users.map(user => ({
        ...user,
        password: undefined
      }));
      res.json(safeUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/admin/users", authenticate, requireAdmin, async (req: any, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // Remove password from response
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.put("/api/admin/users/:id", authenticate, requireAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      
      // Hash password if provided
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }
      
      const user = await storage.updateUser(id.toString(), updateData);
      
      // Remove password from response
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      res.status(400).json({ message: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:id", authenticate, requireAdmin, async (req: any, res) => {
    try {
      const id = req.params.id;
      
      // Prevent deleting own account
      if (id === req.user.id.toString()) {
        return res.status(400).json({ message: "Cannot delete your own account" });
      }
      
      await storage.deleteUser(id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Quote routes
  app.post("/api/quotes", async (req, res) => {
    try {
      const quoteData = insertQuoteSchema.parse(req.body);
      const quote = await storage.createQuote(quoteData);
      
      // Send immediate confirmation
      res.json({ 
        ...quote, 
        message: "Quote has been generated and sent to your email immediately!" 
      });
    } catch (error) {
      console.error("Quote creation error:", error);
      res.status(400).json({ message: "Invalid quote data" });
    }
  });

  app.get("/api/admin/quotes", authenticate, requireAdmin, async (req, res) => {
    try {
      const quotes = await storage.getQuotes();
      res.json(quotes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quotes" });
    }
  });

  app.get("/api/admin/quotes/:id", authenticate, requireAdmin, async (req, res) => {
    try {
      const quote = await storage.getQuote(req.params.id);
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      res.json(quote);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quote" });
    }
  });

  app.put("/api/admin/quotes/:id", authenticate, requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      const updateData = { ...req.body };
      
      // Remove timestamp fields that might come from frontend to avoid conflicts
      delete updateData.createdAt;
      delete updateData.updatedAt;
      
      // Calculate totals from items if items are provided
      if (updateData.items && Array.isArray(updateData.items)) {
        // Ensure items have proper structure and calculations
        updateData.items = updateData.items.map((item: any) => {
          const quantity = parseFloat(item.quantity) || 1;
          const unitPrice = parseFloat(item.unitPrice) || 0;
          const total = quantity * unitPrice;
          
          return {
            id: item.id || Math.random().toString(36).substr(2, 9),
            name: item.name || '',
            description: item.description || '',
            quantity: quantity,
            unit: item.unit || 'pcs',
            unitPrice: unitPrice,
            total: total
          };
        });
        
        // Calculate totals
        const subtotal = updateData.items.reduce((sum: number, item: any) => sum + item.total, 0);
        const vat = subtotal * 0.16;
        const finalTotal = subtotal + vat;
        
        updateData.totalAmount = subtotal.toString();
        updateData.vatAmount = vat.toString();
        updateData.finalTotal = finalTotal.toString();
      }
      
      // Set proper update timestamp
      updateData.updatedAt = new Date();
      
      console.log("Updating quote with data:", updateData);
      
      const quote = await storage.updateQuote(id, updateData);
      res.json(quote);
    } catch (error) {
      console.error("Quote update error:", error);
      res.status(400).json({ message: "Failed to update quote" });
    }
  });

  app.post("/api/admin/quotes/:id/send", authenticate, requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      const quote = await storage.getQuote(id);
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      
      // Mark quote as sent and update status
      await storage.updateQuote(id, { 
        status: 'sent',
        sentAt: new Date() 
      });
      
      await storage.sendQuoteToCustomer(quote);
      res.json({ message: "Quote sent successfully" });
    } catch (error) {
      console.error("Send quote error:", error);
      res.status(500).json({ message: "Failed to send quote" });
    }
  });

  app.delete("/api/admin/quotes/:id", authenticate, requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      await storage.deleteQuote(id);
      res.json({ message: "Quote deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete quote" });
    }
  });

  // Project routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      // Only return completed projects for public view
      const publicProjects = projects.filter(p => p.status === "completed");
      res.json(publicProjects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get("/api/admin/projects", authenticate, requireAdmin, async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/admin/projects", authenticate, requireAdmin, async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  // Blog routes
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      // Only return published posts for public view
      const publishedPosts = posts.filter(p => p.published);
      res.json(publishedPosts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post || !post.published) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.get("/api/admin/blog", authenticate, requireAdmin, async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.post("/api/admin/blog", authenticate, requireAdmin, async (req: any, res) => {
    try {
      console.log("Creating blog post with data:", req.body);
      
      // Transform and validate blog post data
      const transformedData = {
        ...req.body,
        category: req.body.category || "General",
        tags: req.body.tags || [],
        authorId: req.user.id,
        published: req.body.published || false,
      };
      
      const postData = insertBlogPostSchema.parse(transformedData);
      const post = await storage.createBlogPost(postData);
      res.json(post);
    } catch (error: any) {
      console.error("Blog post creation error:", error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Invalid blog post data", 
          details: error.errors.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', '),
          errors: error.errors
        });
      }
      res.status(400).json({ message: "Invalid blog post data", details: error.message });
    }
  });

  app.put("/api/admin/blog/:id", authenticate, requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      const updateData = req.body;
      const post = await storage.updateBlogPost(id, updateData);
      res.json(post);
    } catch (error) {
      res.status(400).json({ message: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog/:id", authenticate, requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      await storage.deleteBlogPost(id);
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Contact routes
  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.json(contact);
    } catch (error) {
      res.status(400).json({ message: "Invalid contact data" });
    }
  });

  app.get("/api/admin/contacts", authenticate, requireAdmin, async (req, res) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  // Team member routes
  app.get("/api/team", async (req, res) => {
    try {
      const teamMembers = await storage.getTeamMembers();
      res.json(teamMembers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  app.get("/api/admin/team", authenticate, requireAdmin, async (req, res) => {
    try {
      const teamMembers = await storage.getTeamMembers();
      res.json(teamMembers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch team members" });
    }
  });

  app.post("/api/admin/team", authenticate, requireAdmin, async (req, res) => {
    try {
      const memberData = insertTeamMemberSchema.parse(req.body);
      const member = await storage.createTeamMember(memberData);
      res.json(member);
    } catch (error) {
      res.status(400).json({ message: "Invalid team member data" });
    }
  });

  app.put("/api/admin/team/:id", authenticate, requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      const updateData = req.body;
      const member = await storage.updateTeamMember(id, updateData);
      res.json(member);
    } catch (error) {
      res.status(400).json({ message: "Failed to update team member" });
    }
  });

  app.delete("/api/admin/team/:id", authenticate, requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      await storage.deleteTeamMember(id);
      res.json({ message: "Team member deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete team member" });
    }
  });

  // Success Stories routes
  app.get("/api/success-stories", async (req, res) => {
    try {
      const stories = await storage.getSuccessStories();
      // Only return active stories for public view
      const activeStories = stories.filter(s => s.active);
      res.json(activeStories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch success stories" });
    }
  });

  app.get("/api/admin/success-stories", authenticate, requireAdmin, async (req, res) => {
    try {
      const stories = await storage.getSuccessStories();
      res.json(stories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch success stories" });
    }
  });

  app.get("/api/admin/analytics", authenticate, requireAdmin, async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.post("/api/admin/success-stories", authenticate, requireAdmin, async (req, res) => {
    try {
      const storyData = insertSuccessStorySchema.parse(req.body);
      const story = await storage.createSuccessStory(storyData);
      res.json(story);
    } catch (error) {
      res.status(400).json({ message: "Invalid success story data" });
    }
  });

  app.put("/api/admin/success-stories/:id", authenticate, requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      const updateData = req.body;
      const story = await storage.updateSuccessStory(id, updateData);
      res.json(story);
    } catch (error) {
      res.status(400).json({ message: "Failed to update success story" });
    }
  });

  app.delete("/api/admin/success-stories/:id", authenticate, requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      await storage.deleteSuccessStory(id);
      res.json({ message: "Success story deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete success story" });
    }
  });

  // Page view tracking for analytics
  app.post("/api/track/pageview", async (req, res) => {
    try {
      const { page, sessionId } = req.body;
      const userAgent = req.headers['user-agent'] || '';
      const ipAddress = req.ip || req.connection.remoteAddress || '';

      await storage.trackPageView({
        page,
        userAgent,
        ipAddress: ipAddress.replace(/^::ffff:/, ''), // Clean IPv4-mapped IPv6
        sessionId
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ success: false });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
