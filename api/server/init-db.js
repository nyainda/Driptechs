import { storage } from "./storage.js";
import { checkDatabaseConnection } from "./db.js";

export async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');
    
    // Check database connection
    await checkDatabaseConnection();
    
    // Initialize admin user
    await storage.initializeAdminUser();
    
    // Initialize demo data only in development
    if (process.env.NODE_ENV !== 'production') {
      await initializeDemoData();
    }
    
    // Initialize default achievements
    await storage.initializeDefaultAchievements();
    
    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

async function initializeDemoData() {
  try {
    // Check if demo data already exists
    const existingProducts = await storage.getProducts();
    if (existingProducts.length > 0) {
      console.log('📦 Demo data already exists, skipping initialization');
      return;
    }

    console.log('🌱 Initializing demo data...');

    // Create demo products
    const demoProducts = [
      {
        name: "Professional Drip Kit Pro 2000",
        category: "drip_irrigation",
        model: "DK-PRO-2000",
        description: "Complete professional drip irrigation system suitable for medium to large farms. Includes pressure regulators, filters, main lines, and emitters.",
        price: "45000.00",
        currency: "KSH",
        images: ["/api/placeholder/600/400"],
        specifications: {
          coverage: "2000 sqm",
          pressure: "1.5-3.0 bar",
          flow_rate: "2-4 L/h per emitter",
          pipe_diameter: "16mm main, 12mm lateral",
          emitter_spacing: "30cm",
          materials: "UV-resistant PE pipes, pressure compensating emitters"
        },
        features: [
          "Pressure compensating emitters",
          "Self-flushing dripline",
          "Integrated filtration system",
          "Weather-resistant components",
          "Easy installation and maintenance"
        ],
        applications: [
          "Vegetable farming",
          "Fruit orchards",
          "Greenhouse cultivation",
          "Nursery operations"
        ],
        inStock: true,
        stockQuantity: 25
      },
      {
        name: "Smart Sprinkler System Elite",
        category: "sprinkler",
        model: "SS-ELITE-1000",
        description: "Advanced sprinkler irrigation system with smart controls and weather sensors. Perfect for lawns, sports fields, and agricultural applications.",
        price: "35000.00",
        currency: "KSH",
        images: ["/api/placeholder/600/400"],
        specifications: {
          coverage: "1000 sqm",
          pressure: "2.0-4.0 bar",
          flow_rate: "15-25 L/min per sprinkler",
          throw_radius: "8-12 meters",
          materials: "Brass and stainless steel components",
          control: "Smart timer with weather sensor"
        },
        features: [
          "Weather-based scheduling",
          "Mobile app control",
          "Adjustable spray patterns",
          "Low water pressure operation",
          "Automatic rain shut-off"
        ],
        applications: [
          "Lawn irrigation",
          "Sports fields",
          "Agricultural crops",
          "Landscape maintenance"
        ],
        inStock: true,
        stockQuantity: 15
      },
      {
        name: "Advanced Filtration System",
        category: "filtration",
        model: "AFS-500",
        description: "Multi-stage water filtration system designed for irrigation applications. Removes sediments, organic matter, and prevents clogging.",
        price: "25000.00",
        currency: "KSH",
        images: ["/api/placeholder/600/400"],
        specifications: {
          flow_rate: "500 L/h",
          filtration: "120 mesh (125 microns)",
          pressure_loss: "< 0.2 bar",
          inlet_size: "2 inches",
          materials: "Corrosion-resistant housing",
          maintenance: "Self-cleaning mechanism"
        },
        features: [
          "Self-cleaning filter",
          "Low pressure drop",
          "Easy maintenance",
          "Corrosion resistant",
          "Long service life"
        ],
        applications: [
          "Drip irrigation systems",
          "Sprinkler systems",
          "Greenhouse irrigation",
          "Industrial water treatment"
        ],
        inStock: true,
        stockQuantity: 30
      }
    ];

    for (const product of demoProducts) {
      await storage.createProduct(product);
    }

    // Create demo projects
    const demoProjects = [
      {
        name: "Kimathi University Farm Irrigation",
        description: "Complete irrigation system installation for 50-acre demonstration farm focusing on sustainable water management and crop optimization.",
        location: "Nyeri County, Kenya",
        projectType: "Educational Institution",
        areaSize: "50 acres",
        value: "2500000.00",
        currency: "KSH",
        status: "completed",
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-04-30'),
        images: ["/api/placeholder/800/400"],
        clientName: "Kimathi University of Technology",
        clientContact: "projects@kimathi.ac.ke",
        equipment: [
          "Drip irrigation systems",
          "Smart controllers",
          "Filtration units",
          "Weather monitoring stations"
        ],
        challenges: "Rocky terrain and varying elevation levels across the farm required careful system design to ensure uniform water distribution.",
        solutions: "Implemented zone-based irrigation with pressure compensating emitters and installed booster pumps at strategic locations.",
        results: "Achieved 40% water savings compared to traditional irrigation methods and increased crop yields by 35%.",
        featured: true
      },
      {
        name: "Mwea Rice Irrigation Modernization",
        description: "Modernization of traditional flood irrigation to efficient water management system for rice production in Mwea irrigation scheme.",
        location: "Kirinyaga County, Kenya",
        projectType: "Agricultural Cooperative",
        areaSize: "200 acres",
        value: "8500000.00",
        currency: "KSH",
        status: "completed",
        startDate: new Date('2023-06-01'),
        endDate: new Date('2024-01-15'),
        images: ["/api/placeholder/800/400"],
        clientName: "Mwea Rice Farmers Cooperative",
        clientContact: "info@mwearice.co.ke",
        equipment: [
          "Automated water gates",
          "Flow measurement systems",
          "Canal lining materials",
          "Water level sensors"
        ],
        challenges: "Converting traditional flood irrigation to modern system while maintaining rice production requirements and farmer acceptance.",
        solutions: "Phased implementation with farmer training programs and demonstration plots to show benefits before full-scale adoption.",
        results: "Reduced water consumption by 30% while maintaining rice yields and improved water distribution efficiency across all plots.",
        featured: true
      }
    ];

    for (const project of demoProjects) {
      await storage.createProject(project);
    }

    // Create demo blog posts
    const demoBlogPosts = [
      {
        title: "Water Conservation Techniques for Kenyan Farmers",
        slug: "water-conservation-techniques-kenyan-farmers",
        content: "Water scarcity is becoming an increasingly critical issue for farmers across Kenya. With climate change affecting rainfall patterns and growing competition for water resources, it's essential for farmers to adopt efficient water conservation techniques...",
        excerpt: "Discover practical water conservation methods that can help Kenyan farmers maximize their crop yields while minimizing water usage.",
        category: "Water Management",
        tags: ["water conservation", "sustainability", "farming tips"],
        author: "Dr. Sarah Kimani",
        featuredImage: "/api/placeholder/800/400",
        published: true,
        publishedAt: new Date(),
        seoTitle: "Water Conservation Techniques for Kenyan Farmers - DripTech",
        seoDescription: "Learn effective water conservation techniques for farming in Kenya. Expert tips on drip irrigation, rainwater harvesting, and soil moisture management.",
        readTime: 8,
        views: 245
      },
      {
        title: "Choosing the Right Irrigation System for Your Farm",
        slug: "choosing-right-irrigation-system-farm",
        content: "Selecting the appropriate irrigation system for your farm is a crucial decision that can significantly impact your crop yields, water efficiency, and overall profitability...",
        excerpt: "A comprehensive guide to help farmers choose the most suitable irrigation system based on their crop type, farm size, and budget.",
        category: "Irrigation Systems",
        tags: ["irrigation", "farming", "decision guide"],
        author: "Engineer Peter Mwangi",
        featuredImage: "/api/placeholder/800/400",
        published: true,
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        seoTitle: "How to Choose the Right Irrigation System - DripTech Guide",
        seoDescription: "Expert guide on selecting irrigation systems for different crops and farm sizes. Compare drip, sprinkler, and surface irrigation methods.",
        readTime: 12,
        views: 189
      }
    ];

    for (const post of demoBlogPosts) {
      await storage.createBlogPost(post);
    }

    // Create demo team members
    const demoTeam = [
      {
        name: "Dr. Sarah Kimani",
        position: "Chief Agronomist",
        department: "Technical Services",
        bio: "Dr. Sarah Kimani brings over 15 years of experience in irrigation and water management. She holds a PhD in Agricultural Engineering and has led numerous successful irrigation projects across East Africa.",
        email: "sarah.kimani@driptech.co.ke",
        phone: "+254 700 100 001",
        image: "/api/placeholder/300/300",
        linkedin: "https://linkedin.com/in/sarah-kimani",
        experience: "15+ years in agricultural engineering and irrigation systems",
        specialties: ["Drip irrigation design", "Water management", "Crop optimization"],
        active: true,
        joinDate: new Date('2020-03-15')
      },
      {
        name: "Engineer Peter Mwangi",
        position: "Senior Installation Engineer",
        department: "Field Operations",
        bio: "Peter is our lead field engineer with extensive experience in irrigation system installation and maintenance. He ensures every project meets our high standards of quality and efficiency.",
        email: "peter.mwangi@driptech.co.ke",
        phone: "+254 700 100 002",
        image: "/api/placeholder/300/300",
        experience: "12+ years in irrigation system installation",
        specialties: ["System installation", "Project management", "Field operations"],
        active: true,
        joinDate: new Date('2021-01-10')
      }
    ];

    for (const member of demoTeam) {
      await storage.createTeamMember(member);
    }

    // Create demo success stories
    const demoSuccessStories = [
      {
        title: "Transforming Smallholder Farming in Machakos",
        clientName: "Grace Wanjiku Farmers Group",
        location: "Machakos County",
        projectType: "Smallholder Farmer Cooperative",
        challenge: "Limited water access and unpredictable rainfall were causing low crop yields and food insecurity for 50 smallholder farmers in the region.",
        solution: "Implemented community-based drip irrigation system with rainwater harvesting and solar-powered pumping system.",
        results: "Farmers achieved 300% increase in crop yields, reduced water usage by 60%, and generated surplus produce for market sale, improving household incomes.",
        metrics: {
          farmers_benefited: 50,
          yield_increase: "300%",
          water_savings: "60%",
          income_increase: "250%"
        },
        testimonial: "This irrigation system has completely changed our lives. We now have enough food for our families and extra to sell at the market. Thank you DripTech!",
        images: ["/api/placeholder/600/400"],
        featured: true,
        active: true,
        timestamp: new Date()
      }
    ];

    for (const story of demoSuccessStories) {
      await storage.createSuccessStory(story);
    }

    console.log('✅ Demo data initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize demo data:', error);
    throw error;
  }
}