
import { db } from './db';
import { users, products, blogPosts, projects, successStories, teamMembers } from '@shared/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...');
    
    // Check if admin user exists
    const adminExists = await db.select().from(users).where(eq(users.email, 'admin@driptech.co.ke')).limit(1);
    
    if (adminExists.length === 0) {
      console.log('👤 Creating default admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await db.insert(users).values({
        email: 'admin@driptech.co.ke',
        password: hashedPassword,
        name: 'System Administrator',
        role: 'super_admin',
        phone: '+254 700 000 000'
      });
      
      console.log('✅ Default admin user created');
    } else {
      console.log('👤 Admin user already exists');
    }
    
    await initializeDemoData();
    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

async function initializeDemoData() {
  try {
    // Check if demo data already exists
    const existingProducts = await db.select().from(products).limit(1);
    if (existingProducts.length > 0) {
      console.log('📦 Demo data already exists, skipping initialization');
      return;
    }

    console.log('🌱 Initializing demo data...');

    // Demo Products
    const demoProducts = [
      {
        name: 'Professional Drip Kit Pro 2000',
        category: 'drip_irrigation',
        model: 'DK-PRO-2000',
        description: 'Complete professional drip irrigation system for medium to large farms. Includes pressure compensating emitters, filtration system, and smart controllers.',
        price: '45000.00',
        currency: 'KSH',
        images: ['/api/placeholder/600/400', '/api/placeholder/600/400'],
        specifications: {
          coverage: '2000 sq meters',
          emitterFlow: '2-4 L/hr',
          pressure: '1.0-2.5 bar',
          material: 'UV resistant polyethylene'
        },
        features: ['Pressure compensating emitters', 'Self-flushing dripline', 'Smart water timer', 'Weather sensors'],
        applications: ['Vegetable farming', 'Greenhouse cultivation', 'Orchards', 'Landscaping'],
        inStock: true,
        stockQuantity: 25
      },
      {
        name: 'Smart Sprinkler System Elite',
        category: 'sprinkler',
        model: 'SS-ELITE-500',
        description: 'Advanced sprinkler system with smart scheduling and weather integration. Perfect for large lawns and agricultural applications.',
        price: '35000.00',
        currency: 'KSH',
        images: ['/api/placeholder/600/400', '/api/placeholder/600/400'],
        specifications: {
          range: '30-50 meters',
          flow: '10-25 L/min',
          pressure: '2.0-4.0 bar',
          coverage: '1500 sq meters'
        },
        features: ['Weather-based scheduling', 'Mobile app control', 'Zone management', 'Water usage tracking'],
        applications: ['Large lawns', 'Sports fields', 'Agricultural fields', 'Public spaces'],
        inStock: true,
        stockQuantity: 15
      },
      {
        name: 'Advanced Filtration System',
        category: 'filtration',
        model: 'AFS-1000',
        description: 'Multi-stage water filtration system designed for irrigation applications. Removes sediments, chemicals, and biological contaminants.',
        price: '25000.00',
        currency: 'KSH',
        images: ['/api/placeholder/600/400'],
        specifications: {
          capacity: '1000 L/hr',
          stages: '5-stage filtration',
          pressure: '1.5-3.0 bar',
          maintenance: 'Quarterly'
        },
        features: ['Multi-stage filtration', 'Auto-backwash', 'Pressure monitoring', 'Easy maintenance'],
        applications: ['Drip irrigation', 'Sprinkler systems', 'Greenhouse', 'Hydroponics'],
        inStock: true,
        stockQuantity: 30
      }
    ];

    for (const product of demoProducts) {
      await db.insert(products).values(product);
    }

    // Demo Blog Posts
    const demoBlogPosts = [
      {
        title: 'Complete Guide to Drip Irrigation for Small Farms',
        slug: 'complete-guide-drip-irrigation-small-farms',
        content: `
# Complete Guide to Drip Irrigation for Small Farms

Drip irrigation is revolutionizing small-scale farming across Kenya. This comprehensive guide will help you understand everything you need to know about implementing drip irrigation on your farm.

## What is Drip Irrigation?

Drip irrigation is a method of watering plants that delivers water directly to the root zone through a network of valves, pipes, tubing, and emitters. This targeted approach significantly reduces water waste while improving crop yields.

## Benefits for Small Farms

### Water Efficiency
- Reduces water usage by up to 50% compared to traditional methods
- Minimizes evaporation and runoff
- Allows precise control over water application

### Improved Yields
- Consistent moisture levels promote healthy plant growth
- Reduced plant stress leads to better fruit quality
- Extended growing seasons possible

### Cost Savings
- Lower water bills
- Reduced labor costs
- Decreased fertilizer requirements

## Getting Started

1. **Assess Your Farm**: Evaluate your water source, soil type, and crop requirements
2. **Design Your System**: Plan the layout considering plant spacing and terrain
3. **Choose Quality Components**: Invest in durable, UV-resistant materials
4. **Professional Installation**: Ensure proper setup for optimal performance

## Maintenance Tips

- Regular cleaning of emitters and filters
- Monitor system pressure
- Inspect for leaks or clogs
- Seasonal system adjustments

Contact DripTech for a customized irrigation solution for your farm!
        `,
        excerpt: 'Learn how drip irrigation can transform your small farm with this comprehensive guide covering benefits, installation, and maintenance.',
        category: 'Agriculture',
        tags: ['drip irrigation', 'small farms', 'water efficiency', 'farming tips'],
        featuredImage: '/api/placeholder/800/400',
        published: true,
        authorId: null
      },
      {
        title: 'Water Conservation Techniques for Kenyan Farmers',
        slug: 'water-conservation-techniques-kenyan-farmers',
        content: `
# Water Conservation Techniques for Kenyan Farmers

With changing weather patterns and increasing water scarcity, Kenyan farmers must adopt smart water conservation strategies to maintain productive and sustainable farming operations.

## Understanding Water Challenges in Kenya

Kenya faces significant water stress, with agriculture consuming about 70% of available water resources. Climate change has made rainfall patterns unpredictable, making efficient water use crucial for food security.

## Proven Conservation Techniques

### 1. Mulching
- Reduces evaporation by up to 70%
- Maintains soil moisture
- Suppresses weed growth
- Improves soil health

### 2. Rainwater Harvesting
- Collect and store rainwater during wet seasons
- Use tanks, ponds, or underground storage
- Reduces dependence on external water sources

### 3. Drip Irrigation Systems
- Delivers water directly to plant roots
- Reduces water waste by 40-60%
- Allows for precise fertilizer application

### 4. Soil Management
- Improve soil structure to increase water retention
- Add organic matter to enhance water-holding capacity
- Practice crop rotation to maintain soil health

## Implementation Strategy

Start with simple techniques like mulching and gradually invest in more advanced systems like drip irrigation. The key is to match the technique to your farm size, budget, and crop type.

Ready to implement water conservation on your farm? Contact DripTech for expert advice and quality irrigation solutions.
        `,
        excerpt: 'Discover practical water conservation techniques that help Kenyan farmers maximize crop yields while minimizing water usage.',
        category: 'Water Conservation',
        tags: ['water conservation', 'sustainability', 'farming', 'Kenya'],
        featuredImage: '/api/placeholder/800/400',
        published: true,
        authorId: null
      }
    ];

    for (const post of demoBlogPosts) {
      await db.insert(blogPosts).values(post);
    }

    // Demo Projects
    const demoProjects = [
      {
        name: 'Kisumu Vegetable Farm Transformation',
        description: 'Complete irrigation system installation for a 5-acre vegetable farm in Kisumu, resulting in 60% water savings and 40% yield increase.',
        location: 'Kisumu, Kenya',
        projectType: 'Commercial Agriculture',
        areaSize: '5 acres',
        value: '850000.00',
        currency: 'KSH',
        status: 'completed',
        startDate: new Date('2023-08-15'),
        endDate: new Date('2023-09-30'),
        images: ['/api/placeholder/800/400', '/api/placeholder/800/400'],
        results: {
          waterSavings: '60%',
          yieldIncrease: '40%',
          cropTypes: ['Tomatoes', 'Onions', 'Spinach'],
          roi: '250%'
        },
        clientId: null
      },
      {
        name: 'Nairobi School Garden Project',
        description: 'Educational drip irrigation system for a primary school garden, teaching students about sustainable agriculture and water conservation.',
        location: 'Nairobi, Kenya',
        projectType: 'Educational',
        areaSize: '0.5 acres',
        value: '120000.00',
        currency: 'KSH',
        status: 'completed',
        startDate: new Date('2023-10-01'),
        endDate: new Date('2023-10-15'),
        images: ['/api/placeholder/800/400'],
        results: {
          studentsEducated: '200',
          cropsGrown: '8 varieties',
          waterSavings: '70%'
        },
        clientId: null
      }
    ];

    for (const project of demoProjects) {
      await db.insert(projects).values(project);
    }

    // Demo Success Stories
    const demoSuccessStories = [
      {
        title: 'From Struggling to Thriving: John\'s Farm Transformation',
        client: 'John Mwangi',
        description: 'John\'s 3-acre tomato farm was struggling with water scarcity and poor yields. After installing our drip irrigation system, he achieved remarkable results.',
        projectType: 'Drip Irrigation',
        location: 'Nakuru',
        areaSize: '3 acres',
        waterSavings: '55%',
        yieldIncrease: '75%',
        image: '/api/placeholder/600/400',
        completedDate: 'September 2023',
        featured: true,
        active: true
      },
      {
        title: 'Community Garden Success in Kibera',
        client: 'Kibera Women\'s Group',
        description: 'A community-driven project that transformed unused land into a productive garden feeding 50 families using efficient drip irrigation.',
        projectType: 'Community Agriculture',
        location: 'Kibera, Nairobi',
        areaSize: '1 acre',
        waterSavings: '65%',
        yieldIncrease: '80%',
        image: '/api/placeholder/600/400',
        completedDate: 'August 2023',
        featured: true,
        active: true
      }
    ];

    for (const story of demoSuccessStories) {
      await db.insert(successStories).values(story);
    }

    // Demo Team Members
    const demoTeamMembers = [
      {
        name: 'David Kiprop',
        position: 'Founder & CEO',
        bio: 'Agricultural engineer with 15+ years of experience in irrigation systems. Passionate about sustainable farming and water conservation in Kenya.',
        image: '/api/placeholder/400/400',
        email: 'david@driptech.co.ke',
        linkedin: 'https://linkedin.com/in/davidkiprop',
        order: 1,
        active: true
      },
      {
        name: 'Sarah Wanjiku',
        position: 'Lead Engineer',
        bio: 'Specialized in drip irrigation design and implementation. Holds a degree in Agricultural Engineering from University of Nairobi.',
        image: '/api/placeholder/400/400',
        email: 'sarah@driptech.co.ke',
        linkedin: 'https://linkedin.com/in/sarahwanjiku',
        order: 2,
        active: true
      },
      {
        name: 'Peter Otieno',
        position: 'Field Operations Manager',
        bio: 'Oversees installation and maintenance operations across Kenya. Expert in project management and customer service.',
        image: '/api/placeholder/400/400',
        email: 'peter@driptech.co.ke',
        order: 3,
        active: true
      }
    ];

    for (const member of demoTeamMembers) {
      await db.insert(teamMembers).values(member);
    }

    console.log('✅ Demo data initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize demo data:', error);
    throw error;
  }
}
