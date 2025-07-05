import Database from "better-sqlite3";
import { NotificationService } from "./notifications";
import type { 
  Product, Quote, Project, BlogPost, Contact, User,
  InsertProduct, InsertQuote, InsertProject, InsertBlogPost, InsertContact, InsertUser
} from "@shared/schema";
import { v4 as uuidv4 } from 'uuid';

const db = new Database("driptech.db");

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    image_url TEXT,
    specifications TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS quotes (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    project_type TEXT NOT NULL,
    area_size TEXT NOT NULL,
    crop_type TEXT,
    location TEXT NOT NULL,
    water_source TEXT,
    distance_to_farm TEXT,
    number_of_beds INTEGER,
    soil_type TEXT,
    budget_range TEXT,
    timeline TEXT,
    requirements TEXT,
    status TEXT DEFAULT 'pending',
    total_amount REAL,
    currency TEXT DEFAULT 'KSH',
    items TEXT,
    notes TEXT,
    assigned_to INTEGER,
    sent_at DATETIME,
    delivery_method TEXT DEFAULT 'email',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    category TEXT,
    location TEXT,
    completion_date TEXT,
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    image_url TEXT,
    author_id INTEGER,
    published BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert default admin user and sample data
const adminExists = db.prepare("SELECT id FROM users WHERE email = ?").get("admin@driptech.co.ke");
if (!adminExists) {
  const bcrypt = await import("bcrypt");
  const hashedPassword = bcrypt.hashSync("admin123", 10);

  db.prepare(`
    INSERT INTO users (id, name, email, password, role)
    VALUES (?, ?, ?, ?, ?)
  `).run(uuidv4(), "Admin User", "admin@driptech.co.ke", hashedPassword, "super_admin");
}

// Insert sample projects if none exist
const projectCount = db.prepare("SELECT COUNT(*) as count FROM projects").get() as { count: number };
if (projectCount.count === 0) {
  const sampleProjects = [
    {
      title: "Kakamega County Irrigation Project",
      description: "Large-scale drip irrigation system installation covering 500 hectares of farmland",
      image_url: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1decc?w=600",
      category: "Agricultural",
      location: "Kakamega County",
      completion_date: "2024-01-15",
      status: "completed"
    },
    {
      title: "Nairobi Urban Farming Initiative",
      description: "Smart irrigation solutions for urban vertical farms in Nairobi",
      image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600",
      category: "Urban Agriculture",
      location: "Nairobi",
      completion_date: "2024-03-10",
      status: "completed"
    },
    {
      title: "Mombasa Greenhouse Complex",
      description: "Automated irrigation system for modern greenhouse vegetable production",
      image_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600",
      category: "Greenhouse",
      location: "Mombasa",
      completion_date: "2024-02-20",
      status: "completed"
    }
  ];

  const insertProject = db.prepare(`
    INSERT INTO projects (id, title, description, image_url, category, location, completion_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const project of sampleProjects) {
    insertProject.run(uuidv4(), project.title, project.description, project.image_url, project.category, project.location, project.completion_date, project.status);
  }
}

// Insert sample products if none exist
const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
if (productCount.count === 0) {
  const sampleProducts = [
    {
      name: "Pressure Compensating Dripper",
      category: "Drip Irrigation",
      price: 25.00,
      description: "High-quality pressure compensating drippers for uniform water distribution",
      image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
      specifications: "Flow rate: 2-4 L/h, Pressure range: 0.5-4 bar, Anti-drain feature"
    },
    {
      name: "Micro Sprinkler System",
      category: "Sprinkler Systems",
      price: 150.00,
      description: "Complete micro sprinkler system for small to medium farms",
      image_url: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1decc?w=400",
      specifications: "Coverage: 3-5m radius, Flow rate: 30-60 L/h, Adjustable spray pattern"
    },
    {
      name: "Filtration System",
      category: "Water Treatment",
      price: 300.00,
      description: "Advanced filtration system for clean irrigation water",
      image_url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
      specifications: "Capacity: 1000 L/h, Multi-stage filtration, Backwash capability"
    },
    {
      name: "Timer Control System",
      category: "Automation",
      price: 200.00,
      description: "Automated irrigation timer with smart scheduling",
      image_url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400",
      specifications: "Multiple programs, Remote control, Weather sensor compatible"
    }
  ];

  const insertProduct = db.prepare(`
    INSERT INTO products (id, name, category, price, description, image_url, specifications)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const product of sampleProducts) {
    insertProduct.run(uuidv4(), product.name, product.category, product.price, product.description, product.image_url, product.specifications);
  }
}

// Storage class implementation
export class Storage {
  // User methods
  async getUsers(): Promise<User[]> {
    return db.prepare("SELECT * FROM users ORDER BY created_at DESC").all() as User[];
  }

  async getUser(id: string): Promise<User | null> {
    return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as User | null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return db.prepare("SELECT * FROM users WHERE email = ?").get(email) as User | null;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = uuidv4();
    db.prepare(`
      INSERT INTO users (id, name, email, password, role)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, userData.name, userData.email, userData.password, userData.role || 'user');

    return this.getUser(id)!;
  }

  async updateUser(id: string, updateData: Partial<InsertUser>): Promise<User> {
    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);

    db.prepare(`UPDATE users SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
      .run(...values, id);

    return this.getUser(id)!;
  }

  async deleteUser(id: string): Promise<void> {
    db.prepare("DELETE FROM users WHERE id = ?").run(id);
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return db.prepare("SELECT * FROM products ORDER BY created_at DESC").all() as Product[];
  }

  async getProduct(id: string): Promise<Product | null> {
    return db.prepare("SELECT * FROM products WHERE id = ?").get(id) as Product | null;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return db.prepare("SELECT * FROM products WHERE category = ? ORDER BY created_at DESC").all(category) as Product[];
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const id = uuidv4();
    db.prepare(`
      INSERT INTO products (id, name, category, price, description, image_url, specifications)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, productData.name, productData.category, productData.price, productData.description, productData.image_url, productData.specifications);

    return this.getProduct(id)!;
  }

  async updateProduct(id: string, updateData: Partial<InsertProduct>): Promise<Product> {
    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);

    db.prepare(`UPDATE products SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
      .run(...values, id);

    return this.getProduct(id)!;
  }

  async deleteProduct(id: string): Promise<void> {
    db.prepare("DELETE FROM products WHERE id = ?").run(id);
  }

  // Quote methods
  async getQuotes(): Promise<Quote[]> {
    return db.prepare("SELECT * FROM quotes ORDER BY created_at DESC").all() as Quote[];
  }

  async getQuote(id: string): Promise<Quote | null> {
    return db.prepare("SELECT * FROM quotes WHERE id = ?").get(id) as Quote | null;
  }

  async createQuote(quoteData: InsertQuote): Promise<Quote> {
    const id = uuidv4();
    const result = db.prepare(`
      INSERT INTO quotes (
        id, customer_name, customer_email, customer_phone, project_type, area_size, 
        crop_type, location, water_source, distance_to_farm, number_of_beds, 
        soil_type, budget_range, timeline, requirements, status, delivery_method
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, quoteData.customerName, quoteData.customerEmail, quoteData.customerPhone,
      quoteData.projectType, quoteData.areaSize, quoteData.cropType,
      quoteData.location, quoteData.waterSource, quoteData.distanceToFarm,
      quoteData.numberOfBeds, quoteData.soilType, quoteData.budgetRange,
      quoteData.timeline, quoteData.requirements, 'pending', 'email'
    );

    const quote = this.getQuote(id)!;

    // Auto-send quote immediately only if customer data exists
    if (quote.customerEmail && quote.customerName) {
      await this.sendQuoteToCustomer(quote);
    }

    return quote;
  }

  async sendQuoteToCustomer(quote: Quote): Promise<void> {
    try {
      // Validate required fields
      if (!quote.customerEmail || !quote.customerName) {
        console.error('❌ Quote missing required customer information');
        return;
      }

      // Update status to sent
      db.prepare(`
        UPDATE quotes SET status = 'sent', sent_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `).run(quote.id);

      // Send notifications through multiple channels
      await NotificationService.sendQuoteEmail(quote);

      // Only send SMS if phone number exists
      if (quote.customerPhone) {
        await NotificationService.sendSMSNotification(quote);

        // Send WhatsApp if phone number is mobile
        if (quote.customerPhone.includes('254') || quote.customerPhone.startsWith('07')) {
          await NotificationService.sendWhatsAppNotification(quote);
        }
      }

      console.log(`✅ Quote #${quote.id} sent successfully to ${quote.customerEmail}`);
    } catch (error) {
      console.error('❌ Failed to send quote:', error);
    }
  }

  async updateQuote(id: string, updateData: Partial<InsertQuote>): Promise<Quote> {
    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);

    db.prepare(`UPDATE quotes SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
      .run(...values, id);

    return this.getQuote(id)!;
  }

  async deleteQuote(id: string): Promise<void> {
    db.prepare("DELETE FROM quotes WHERE id = ?").run(id);
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    return db.prepare("SELECT * FROM projects ORDER BY created_at DESC").all() as Project[];
  }

  async createProject(projectData: InsertProject): Promise<Project> {
    const id = uuidv4();
    db.prepare(`
      INSERT INTO projects (id, title, description, image_url, category, location, completion_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, projectData.title, projectData.description, projectData.image_url,
      projectData.category, projectData.location, projectData.completion_date,
      projectData.status || 'active'
    );

    return db.prepare("SELECT * FROM projects WHERE id = ?").get(id) as Project;
  }

  // Blog methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return db.prepare("SELECT * FROM blog_posts ORDER BY created_at DESC").all() as BlogPost[];
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    return db.prepare("SELECT * FROM blog_posts WHERE slug = ?").get(slug) as BlogPost | null;
  }

  async createBlogPost(postData: InsertBlogPost): Promise<BlogPost> {
    const id = uuidv4();
    const result = db.prepare(`
      INSERT INTO blog_posts (id, title, slug, content, excerpt, image_url, author_id, published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, postData.title, postData.slug, postData.content, postData.excerpt,
      postData.image_url, postData.author_id, postData.published || false
    );

    return db.prepare("SELECT * FROM blog_posts WHERE id = ?").get(id) as BlogPost;
  }

  async updateBlogPost(id: string, updateData: Partial<InsertBlogPost>): Promise<BlogPost> {
    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);

    db.prepare(`UPDATE blog_posts SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
      .run(...values, id);

    return db.prepare("SELECT * FROM blog_posts WHERE id = ?").get(id) as BlogPost;
  }

  async deleteBlogPost(id: string): Promise<void> {
    db.prepare("DELETE FROM blog_posts WHERE id = ?").run(id);
  }

  // Contact methods
  async getContacts(): Promise<Contact[]> {
    return db.prepare("SELECT * FROM contacts ORDER BY created_at DESC").all() as Contact[];
  }

  async createContact(contactData: InsertContact): Promise<Contact> {
    const id = uuidv4();
    const result = db.prepare(`
      INSERT INTO contacts (id, name, email, phone, company, subject, message)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id, contactData.name, contactData.email, contactData.phone,
      contactData.company, contactData.subject, contactData.message
    );

    return db.prepare("SELECT * FROM contacts WHERE id = ?").get(id) as Contact;
  }
}

export const storage = new Storage();