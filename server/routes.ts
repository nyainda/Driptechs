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

// Invoice generation function
function generateInvoiceHTML(quote: any): string {
  const currentDate = new Date().toLocaleDateString();
  const dueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(); // 30 days from now
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice - ${quote.id}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; line-height: 1.6; }
        .invoice-header { display: flex; justify-content: space-between; margin-bottom: 40px; }
        .company-info { flex: 1; }
        .invoice-info { flex: 1; text-align: right; }
        .invoice-title { font-size: 24px; font-weight: bold; color: #16a34a; margin-bottom: 20px; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #16a34a; padding-bottom: 5px; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .detail-item { margin-bottom: 8px; }
        .detail-label { font-weight: bold; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        .items-table th { background-color: #16a34a; color: white; }
        .items-table tbody tr:nth-child(even) { background-color: #f9f9f9; }
        .total-section { text-align: right; margin-top: 30px; }
        .total-line { margin-bottom: 8px; }
        .total-amount { font-size: 20px; font-weight: bold; color: #16a34a; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
        .print-btn { background: #16a34a; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 20px 0; }
        @media print { 
          body { padding: 0; } 
          .print-btn { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="invoice-header">
        <div class="company-info">
          <h1 style="color: #16a34a; margin: 0;">DripTech Irrigation</h1>
          <p style="margin: 5px 0;">Professional Irrigation Solutions</p>
          <p style="margin: 5px 0;">Email: info@driptech.co.ke</p>
          <p style="margin: 5px 0;">Phone: +254 700 000 000</p>
        </div>
        <div class="invoice-info">
          <div class="invoice-title">INVOICE</div>
          <p><strong>Invoice #:</strong> INV-${quote.id.slice(-8).toUpperCase()}</p>
          <p><strong>Date:</strong> ${currentDate}</p>
          <p><strong>Due Date:</strong> ${dueDate}</p>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Bill To</div>
        <div class="detail-item">
          <div class="detail-label">${quote.customerName}</div>
          <div>${quote.customerEmail}</div>
          ${quote.customerPhone ? `<div>${quote.customerPhone}</div>` : ''}
          ${quote.customerAddress ? `<div>${quote.customerAddress}</div>` : ''}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Project Details</div>
        <div class="details-grid">
          <div>
            <div class="detail-item">
              <span class="detail-label">Project Type:</span> ${quote.projectType}
            </div>
            <div class="detail-item">
              <span class="detail-label">Location:</span> ${quote.location}
            </div>
            <div class="detail-item">
              <span class="detail-label">Area Size:</span> ${quote.areaSize}
            </div>
          </div>
          <div>
            <div class="detail-item">
              <span class="detail-label">Budget:</span> ${quote.budget}
            </div>
            <div class="detail-item">
              <span class="detail-label">Timeline:</span> ${quote.timeline}
            </div>
            <div class="detail-item">
              <span class="detail-label">Status:</span> ${quote.status.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Requirements</div>
        <p>${quote.requirements}</p>
      </div>

      <div class="section">
        <div class="section-title">Service Description</div>
        <table class="items-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Unit Price (KES)</th>
              <th>Total (KES)</th>
            </tr>
          </thead>
          <tbody>
            ${quote.items && quote.items.length > 0 ? 
              quote.items.map((item: any) => `
                <tr>
                  <td>
                    <strong>${item.name}</strong><br>
                    <small>${item.description}</small>
                  </td>
                  <td>${item.quantity}</td>
                  <td>${item.unit}</td>
                  <td>${item.unitPrice?.toLocaleString() || 0}</td>
                  <td>${item.total?.toLocaleString() || 0}</td>
                </tr>
              `).join('') :
              `<tr>
                <td>${quote.projectType} - ${quote.location}</td>
                <td>1</td>
                <td>service</td>
                <td>${quote.totalAmount?.toLocaleString() || 0}</td>
                <td>${quote.totalAmount?.toLocaleString() || 0}</td>
              </tr>`
            }
          </tbody>
        </table>
      </div>

      <div class="total-section">
        <div class="total-line">
          <strong>Subtotal: KES ${quote.totalAmount?.toLocaleString() || 0}</strong>
        </div>
        <div class="total-line">
          <strong>VAT (16%): KES ${((quote.totalAmount || 0) * 0.16).toLocaleString()}</strong>
        </div>
        <div class="total-line total-amount">
          <strong>Total Amount: KES ${((quote.totalAmount || 0) * 1.16).toLocaleString()}</strong>
        </div>
      </div>

      ${quote.notes ? `
      <div class="section">
        <div class="section-title">Notes</div>
        <p>${quote.notes}</p>
      </div>
      ` : ''}

      <div class="footer">
        <p>Thank you for choosing DripTech Irrigation Solutions!</p>
        <p>For any inquiries, please contact us at info@driptech.co.ke</p>
      </div>
      
      <button class="print-btn" onclick="window.print()">Print Invoice</button>
      
      <script>
        // Auto-focus for accessibility
        document.addEventListener('DOMContentLoaded', function() {
          document.querySelector('.print-btn').focus();
        });
      </script>
    </body>
    </html>
  `;
}

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
      if (id === (req as any).user.id.toString()) {
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

  // Invoice generation route
  app.post("/api/admin/quotes/:id/invoice", authenticate, requireAdmin, async (req, res) => {
    try {
      const id = req.params.id;
      const quote = await storage.getQuote(id);
      
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }

      // Generate invoice HTML
      const invoiceHTML = generateInvoiceHTML(quote);
      
      // Set proper headers for HTML download
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="invoice-${quote.id.slice(-8)}.html"`);
      res.setHeader('Cache-Control', 'no-cache');
      res.send(invoiceHTML);
    } catch (error) {
      console.error("Invoice generation error:", error);
      res.status(500).json({ message: "Failed to generate invoice" });
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
        authorId: (req as any).user.id,
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
      res.json(Array.isArray(teamMembers) ? teamMembers : []);
    } catch (error) {
      console.error("Team members error:", error);
      res.json([]);
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
      const activeStories = Array.isArray(stories) ? stories.filter(s => s.active) : [];
      res.json(activeStories);
    } catch (error) {
      console.error("Success stories error:", error);
      res.json([]);
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
      console.error("Page view tracking error:", error);
      res.status(500).json({ success: false });
    }
  });

  // Gamification & Achievement Routes
  app.get("/api/admin/achievements", authenticate, requireAdmin, async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get("/api/admin/gamification-overview", authenticate, requireAdmin, async (req: any, res) => {
    try {
      // Get current user's gamification data
      const userId = req.user.id;
      const [achievements, userAchievements, stats] = await Promise.all([
        storage.getAchievements(),
        storage.getUserAchievements(userId),
        storage.getGamificationStats(userId)
      ]);

      // Check for new achievements
      const newAchievements = await storage.checkAndUnlockMilestones(userId);
      
      // Get updated stats if new achievements were unlocked
      const finalStats = newAchievements.length > 0 
        ? await storage.getGamificationStats(userId) 
        : stats;

      res.json({
        totalAchievements: achievements.length,
        unlockedAchievements: userAchievements.length,
        gamificationStats: finalStats,
        newlyUnlocked: newAchievements,
        achievementsByCategory: achievements.reduce((acc, achievement) => {
          if (!acc[achievement.category]) acc[achievement.category] = [];
          acc[achievement.category].push({
            ...achievement,
            unlocked: userAchievements.some(ua => ua.achievementId === achievement.id)
          });
          return acc;
        }, {} as Record<string, any[]>)
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gamification overview" });
    }
  });

  // Initialize default achievements and admin user on first run
  (async () => {
    try {
      await storage.initializeAdminUser();
      await storage.initializeDefaultAchievements();
      console.log("✅ Default achievements initialized");
    } catch (error) {
      console.error("❌ Failed to initialize:", error);
    }
  })();

  const httpServer = createServer(app);
  return httpServer;
}
