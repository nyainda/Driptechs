import { 
  users, products, quotes, projects, blogPosts, contacts,
  type User, type InsertUser, type Product, type InsertProduct, 
  type Quote, type InsertQuote, type Project, type InsertProject,
  type BlogPost, type InsertBlogPost, type Contact, type InsertContact
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User>;
  
  // Product operations
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<Product>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  
  // Quote operations
  getQuotes(): Promise<Quote[]>;
  getQuote(id: number): Promise<Quote | undefined>;
  createQuote(quote: InsertQuote): Promise<Quote>;
  updateQuote(id: number, quote: Partial<Quote>): Promise<Quote>;
  deleteQuote(id: number): Promise<void>;
  
  // Project operations
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<Project>): Promise<Project>;
  deleteProject(id: number): Promise<void>;
  
  // Blog operations
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<BlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;
  
  // Contact operations
  getContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  updateContact(id: number, contact: Partial<Contact>): Promise<Contact>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private products: Map<number, Product> = new Map();
  private quotes: Map<number, Quote> = new Map();
  private projects: Map<number, Project> = new Map();
  private blogPosts: Map<number, BlogPost> = new Map();
  private contacts: Map<number, Contact> = new Map();
  
  private currentUserId = 1;
  private currentProductId = 1;
  private currentQuoteId = 1;
  private currentProjectId = 1;
  private currentBlogPostId = 1;
  private currentContactId = 1;

  constructor() {
    // Initialize with real product data
    this.initializeData();
  }

  private initializeData() {
    // Create admin user
    const adminUser: User = {
      id: this.currentUserId++,
      email: "admin@driptech.co.ke",
      password: "$2b$10$rQqZ3qXKhUJZBkwzJqKuYe8oLyqOQHj5xKhUJZBkwzJqKuYe8oLyqO", // "admin123"
      name: "Admin User",
      role: "admin",
      phone: "+254700123456",
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Initialize real irrigation products
    const realProducts: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: "Pressure Compensating Dripper",
        category: "drip_irrigation",
        model: "PC-4L",
        description: "High-performance pressure compensating dripper with self-flushing capability. Ideal for greenhouse and open field applications.",
        price: "150.00",
        currency: "KSH",
        images: ["https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800"],
        specifications: {
          flowRate: "2-8 L/h",
          operatingPressure: "1-4 bar",
          pressureCompensation: "1-4 bar",
          dripperSpacing: "20-50 cm",
          tubeDiameter: "16-20 mm",
          material: "UV resistant polypropylene",
          temperatureRange: "-10°C to +50°C",
          filtrationRequirement: "120 mesh minimum",
          cloggingResistance: "Self-flushing mechanism",
          warranty: "2 years"
        },
        features: [
          "Pressure compensating technology",
          "Self-flushing capabilities", 
          "UV resistant materials",
          "Consistent flow rates",
          "Easy installation"
        ],
        applications: [
          "Greenhouse cultivation",
          "Open field crops",
          "Orchards and vineyards",
          "Vegetable production",
          "Floriculture"
        ],
        inStock: true,
        stockQuantity: 1000,
      },
      {
        name: "Impact Sprinkler System",
        category: "sprinkler",
        model: "IS-25",
        description: "Heavy-duty impact sprinkler with adjustable spray pattern and wind-resistant design. Perfect for large area irrigation.",
        price: "8500.00",
        currency: "KSH",
        images: ["https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800"],
        specifications: {
          sprayDiameter: "10-25 m",
          operatingPressure: "2-6 bar",
          flowRate: "0.5-3.5 m³/h",
          nozzleSizes: "3-8 mm",
          rotationSpeed: "1-3 RPM",
          windResistance: "Up to 15 km/h",
          material: "Brass and stainless steel",
          mountingOptions: "Spike, tripod, riser",
          sprayAngle: "Full circle, part circle",
          maintenanceInterval: "6 months"
        },
        features: [
          "360° rotation capability",
          "Wind resistant design",
          "Adjustable arc settings",
          "Durable construction",
          "Multiple nozzle options"
        ],
        applications: [
          "Large scale farming",
          "Sports fields",
          "Landscaping",
          "Pasture irrigation",
          "Dust suppression"
        ],
        inStock: true,
        stockQuantity: 150,
      },
      {
        name: "Multi-Stage Filtration System",
        category: "filtration",
        model: "MFS-50",
        description: "Advanced multi-stage filtration system with automatic backwash capability. Ensures clean water for optimal irrigation performance.",
        price: "25000.00",
        currency: "KSH",
        images: ["https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800"],
        specifications: {
          filtrationRange: "20-200 microns",
          flowCapacity: "5-50 m³/h",
          pressureRating: "10 bar",
          backwashPressure: "3-4 bar",
          housingMaterial: "Stainless steel 316",
          screenMaterial: "Stainless steel mesh",
          connectionSizes: "2-8 inches",
          pressureLoss: "0.2-0.5 bar",
          automationLevel: "Manual or automatic",
          maintenanceFrequency: "Monthly inspection"
        },
        features: [
          "Multi-stage filtration",
          "Automatic backwash",
          "Low pressure drop",
          "Corrosion resistant",
          "Easy maintenance"
        ],
        applications: [
          "Drip irrigation systems",
          "Sprinkler systems",
          "Greenhouse operations",
          "Hydroponic systems",
          "Industrial applications"
        ],
        inStock: true,
        stockQuantity: 75,
      },
      {
        name: "Smart Irrigation Controller",
        category: "control",
        model: "SIC-24",
        description: "IoT-enabled smart irrigation controller with weather integration and mobile app control. Optimizes water usage automatically.",
        price: "18000.00",
        currency: "KSH",
        images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"],
        specifications: {
          zones: "4-24 zones",
          power: "24V AC/DC",
          weatherSensors: "Rain, wind, temperature",
          communicationProtocol: "WiFi, GSM, LoRa",
          displayType: "LCD touchscreen",
          memoryCapacity: "1000 programs",
          batteryBackup: "72 hours",
          environmentalRating: "IP65",
          mountingOptions: "Wall mount, panel mount",
          programmingOptions: "Multiple start times, seasonal adjust"
        },
        features: [
          "Weather sensor compatible",
          "Mobile app control",
          "Multiple programming options",
          "Remote monitoring",
          "Energy efficient"
        ],
        applications: [
          "Greenhouse automation",
          "Landscape irrigation",
          "Agricultural fields",
          "Sports facilities",
          "Municipal irrigation"
        ],
        inStock: true,
        stockQuantity: 200,
      },
      {
        name: "Precision Fertigation System",
        category: "fertigation",
        model: "PFS-500",
        description: "Precision fertigation system with automated nutrient mixing and injection. Ensures optimal crop nutrition and growth.",
        price: "35000.00",
        currency: "KSH",
        images: ["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800"],
        specifications: {
          injectionRate: "0.5-5%",
          tankCapacity: "50-500 L",
          pumpType: "Dosing pump",
          controlAccuracy: "±2%",
          chemicalCompatibility: "Most fertilizers",
          safetyFeatures: "Leak detection, pressure relief",
          calibrationProcedure: "Digital calibration",
          maintenanceRequirements: "Monthly cleaning",
          integrationCapability: "Irrigation controllers",
          monitoring: "EC, pH sensors"
        },
        features: [
          "Precise nutrient control",
          "Chemical compatibility",
          "Automated mixing",
          "Safety features",
          "Remote monitoring"
        ],
        applications: [
          "Greenhouse production",
          "Hydroponic systems",
          "High-value crops",
          "Research facilities",
          "Commercial farming"
        ],
        inStock: true,
        stockQuantity: 50,
      },
      {
        name: "HDPE Irrigation Pipe",
        category: "accessories",
        model: "HDPE-32",
        description: "High-quality HDPE irrigation pipe with UV resistance and chemical compatibility. Available in various diameters.",
        price: "120.00",
        currency: "KSH",
        images: ["https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800"],
        specifications: {
          diameter: "16-110 mm",
          pressureRating: "4-25 bar",
          material: "High-density polyethylene",
          uvResistance: "UV8 rating",
          chemicalResistance: "Excellent",
          connectionType: "Compression fittings",
          installationMethod: "Trenching or surface",
          pressureLossCalculation: "Hazen-Williams formula",
          expansionJoints: "Required for long runs",
          warranty: "10 years"
        },
        features: [
          "UV resistant HDPE",
          "Chemical resistant",
          "Easy installation",
          "Flexible design",
          "Long service life"
        ],
        applications: [
          "Main distribution lines",
          "Secondary networks",
          "Greenhouse piping",
          "Residential irrigation",
          "Commercial systems"
        ],
        inStock: true,
        stockQuantity: 5000,
      }
    ];

    realProducts.forEach(product => {
      const fullProduct: Product = {
        ...product,
        id: this.currentProductId++,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.products.set(fullProduct.id, fullProduct);
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      id: this.currentUserId++,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updateData: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Product operations
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.category === category);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const product: Product = {
      ...insertProduct,
      id: this.currentProductId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.set(product.id, product);
    return product;
  }

  async updateProduct(id: number, updateData: Partial<Product>): Promise<Product> {
    const product = this.products.get(id);
    if (!product) throw new Error("Product not found");
    
    const updatedProduct = { ...product, ...updateData, updatedAt: new Date() };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    this.products.delete(id);
  }

  // Quote operations
  async getQuotes(): Promise<Quote[]> {
    return Array.from(this.quotes.values());
  }

  async getQuote(id: number): Promise<Quote | undefined> {
    return this.quotes.get(id);
  }

  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const quote: Quote = {
      ...insertQuote,
      id: this.currentQuoteId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.quotes.set(quote.id, quote);
    return quote;
  }

  async updateQuote(id: number, updateData: Partial<Quote>): Promise<Quote> {
    const quote = this.quotes.get(id);
    if (!quote) throw new Error("Quote not found");
    
    const updatedQuote = { ...quote, ...updateData, updatedAt: new Date() };
    this.quotes.set(id, updatedQuote);
    return updatedQuote;
  }

  async deleteQuote(id: number): Promise<void> {
    this.quotes.delete(id);
  }

  // Project operations
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const project: Project = {
      ...insertProject,
      id: this.currentProjectId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(project.id, project);
    return project;
  }

  async updateProject(id: number, updateData: Partial<Project>): Promise<Project> {
    const project = this.projects.get(id);
    if (!project) throw new Error("Project not found");
    
    const updatedProject = { ...project, ...updateData, updatedAt: new Date() };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<void> {
    this.projects.delete(id);
  }

  // Blog operations
  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find(post => post.slug === slug);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const post: BlogPost = {
      ...insertPost,
      id: this.currentBlogPostId++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogPosts.set(post.id, post);
    return post;
  }

  async updateBlogPost(id: number, updateData: Partial<BlogPost>): Promise<BlogPost> {
    const post = this.blogPosts.get(id);
    if (!post) throw new Error("Blog post not found");
    
    const updatedPost = { ...post, ...updateData, updatedAt: new Date() };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<void> {
    this.blogPosts.delete(id);
  }

  // Contact operations
  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const contact: Contact = {
      ...insertContact,
      id: this.currentContactId++,
      createdAt: new Date(),
    };
    this.contacts.set(contact.id, contact);
    return contact;
  }

  async updateContact(id: number, updateData: Partial<Contact>): Promise<Contact> {
    const contact = this.contacts.get(id);
    if (!contact) throw new Error("Contact not found");
    
    const updatedContact = { ...contact, ...updateData };
    this.contacts.set(id, updatedContact);
    return updatedContact;
  }
}

export const storage = new MemStorage();
