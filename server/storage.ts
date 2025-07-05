import Database from "better-sqlite3";
import type { 
  Product, Quote, Project, BlogPost, Contact, User,
  InsertProduct, InsertQuote, InsertProject, InsertBlogPost, InsertContact, InsertUser
} from "@shared/schema";

const db = new Database("driptech.db");

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    project_type TEXT NOT NULL,
    farm_size REAL,
    crop_type TEXT,
    water_source TEXT,
    budget_range TEXT,
    timeline TEXT,
    additional_requirements TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
  const bcrypt = require("bcrypt");
  const hashedPassword = bcrypt.hashSync("admin123", 10);

  db.prepare(`
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `).run("Admin User", "admin@driptech.co.ke", hashedPassword, "super_admin");
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
    INSERT INTO projects (title, description, image_url, category, location, completion_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const project of sampleProjects) {
    insertProject.run(project.title, project.description, project.image_url, project.category, project.location, project.completion_date, project.status);
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
    INSERT INTO products (name, category, price, description, image_url, specifications)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const product of sampleProducts) {
    insertProduct.run(product.name, product.category, product.price, product.description, product.image_url, product.specifications);
  }
}

// Storage class implementation
export class Storage {
  // User methods
  async getUsers(): Promise<User[]> {
    return db.prepare("SELECT * FROM users ORDER BY created_at DESC").all() as User[];
  }

  async getUser(id: number): Promise<User | null> {
    return db.prepare("SELECT * FROM users WHERE id = ?").get(id) as User | null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return db.prepare("SELECT * FROM users WHERE email = ?").get(email) as User | null;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const result = db.prepare(`
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `).run(userData.name, userData.email, userData.password, userData.role || 'user');

    return this.getUser(result.lastInsertRowid as number)!;
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User> {
    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);

    db.prepare(`UPDATE users SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
      .run(...values, id);

    return this.getUser(id)!;
  }

  async deleteUser(id: number): Promise<void> {
    db.prepare("DELETE FROM users WHERE id = ?").run(id);
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return db.prepare("SELECT * FROM products ORDER BY created_at DESC").all() as Product[];
  }

  async getProduct(id: number): Promise<Product | null> {
    return db.prepare("SELECT * FROM products WHERE id = ?").get(id) as Product | null;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return db.prepare("SELECT * FROM products WHERE category = ? ORDER BY created_at DESC").all(category) as Product[];
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const result = db.prepare(`
      INSERT INTO products (name, category, price, description, image_url, specifications)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(productData.name, productData.category, productData.price, productData.description, productData.image_url, productData.specifications);

    return this.getProduct(result.lastInsertRowid as number)!;
  }

  async updateProduct(id: number, updateData: Partial<InsertProduct>): Promise<Product> {
    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);

    db.prepare(`UPDATE products SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
      .run(...values, id);

    return this.getProduct(id)!;
  }

  async deleteProduct(id: number): Promise<void> {
    db.prepare("DELETE FROM products WHERE id = ?").run(id);
  }

  // Quote methods
  async getQuotes(): Promise<Quote[]> {
    return db.prepare("SELECT * FROM quotes ORDER BY created_at DESC").all() as Quote[];
  }

  async getQuote(id: number): Promise<Quote | null> {
    return db.prepare("SELECT * FROM quotes WHERE id = ?").get(id) as Quote | null;
  }

  async createQuote(quoteData: InsertQuote): Promise<Quote> {
    const result = db.prepare(`
      INSERT INTO quotes (name, email, phone, company, project_type, farm_size, crop_type, water_source, budget_range, timeline, additional_requirements, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      quoteData.name, quoteData.email, quoteData.phone, quoteData.company,
      quoteData.project_type, quoteData.farm_size, quoteData.crop_type,
      quoteData.water_source, quoteData.budget_range, quoteData.timeline,
      quoteData.additional_requirements, quoteData.status || 'pending'
    );

    return this.getQuote(result.lastInsertRowid as number)!;
  }

  async updateQuote(id: number, updateData: Partial<InsertQuote>): Promise<Quote> {
    const fields = Object.keys(updateData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updateData);

    db.prepare(`UPDATE quotes SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
      .run(...values, id);

    return this.getQuote(id)!;
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    return db.prepare("SELECT * FROM projects ORDER BY created_at DESC").all() as Project[];
  }

  async createProject(projectData: InsertProject): Promise<Project> {
    const result = db.prepare(`
      INSERT INTO projects (title, description, image_url, category, location, completion_date, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      projectData.title, projectData.description, projectData.image_url,
      projectData.category, projectData.location, projectData.completion_date,
      projectData.status || 'active'
    );

    return db.prepare("SELECT * FROM projects WHERE id = ?").get(result.lastInsertRowid) as Project;
  }

  // Blog methods
  async getBlogPosts(): Promise<BlogPost[]> {
    return db.prepare("SELECT * FROM blog_posts ORDER BY created_at DESC").all() as BlogPost[];
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    return db.prepare("SELECT * FROM blog_posts WHERE slug = ?").get(slug) as BlogPost | null;
  }

  async createBlogPost(postData: InsertBlogPost): Promise<BlogPost> {
    const result = db.prepare(`
      INSERT INTO blog_posts (title, slug, content, excerpt, image_url, author_id, published)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      postData.title, postData.slug, postData.content, postData.excerpt,
      postData.image_url, postData.author_id, postData.published || false
    );

    return db.prepare("SELECT * FROM blog_posts WHERE id = ?").get(result.lastInsertRowid) as BlogPost;
  }

  // Contact methods
  async getContacts(): Promise<Contact[]> {
    return db.prepare("SELECT * FROM contacts ORDER BY created_at DESC").all() as Contact[];
  }

  async createContact(contactData: InsertContact): Promise<Contact> {
    const result = db.prepare(`
      INSERT INTO contacts (name, email, phone, company, subject, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      contactData.name, contactData.email, contactData.phone,
      contactData.company, contactData.subject, contactData.message
    );

    return db.prepare("SELECT * FROM contacts WHERE id = ?").get(result.lastInsertRowid) as Contact;
  }
}

export const storage = new Storage();