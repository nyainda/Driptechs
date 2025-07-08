
import { db } from './db';
import { users } from '@shared/schema';
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
    
    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}
