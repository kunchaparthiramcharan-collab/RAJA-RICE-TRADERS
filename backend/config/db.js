const { createClient } = require('@libsql/client');
const bcrypt = require('bcryptjs');
// Build: 2026-06-28T18:21

// Read environment variables
const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
const url = process.env.TURSO_CONNECTION_URL || (isVercel ? 'file:/tmp/local.db' : 'file:local.db');
const authToken = process.env.TURSO_AUTH_TOKEN || '';

console.log(`🔌 Database Connection URL: ${url}`);

const db = createClient({
  url,
  authToken,
});

const connectDB = async () => {
  try {
    // 1. Create Tables if they don't exist
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        price REAL NOT NULL,
        packageSizes TEXT NOT NULL,
        imageUrl TEXT NOT NULL,
        inStock INTEGER DEFAULT 1,
        stockQuantity INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customerName TEXT NOT NULL,
        customerPhone TEXT NOT NULL,
        customerEmail TEXT NOT NULL,
        products TEXT NOT NULL,
        status TEXT DEFAULT 'Pending',
        message TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await db.execute(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        code TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Alter users table to add email column if not exists
    try {
      await db.execute('ALTER TABLE users ADD COLUMN email TEXT');
      console.log('✅ Added email column to users table.');
    } catch (e) {
      // Column already exists, ignore error
    }

    try {
      await db.execute("UPDATE users SET email = 'rajaricetraders01@gmail.com' WHERE username = 'admin' AND (email IS NULL OR email = '')");
      await db.execute("UPDATE users SET email = 'kunchaparthiramcharan@gmail.com' WHERE username = 'raju12' AND (email IS NULL OR email = '')");
      console.log('✅ Updated admin email addresses in users table.');
    } catch (e) {
      console.error('⚠️ Error updating admin emails:', e.message);
    }

    console.log('✅ SQLite/Turso tables checked/created successfully.');

    // 2. Auto-Seed Users if empty
    const usersCountRes = await db.execute('SELECT COUNT(*) as count FROM users');
    const usersCount = usersCountRes.rows[0].count;
    if (usersCount === 0) {
      console.log('🌱 Database is fresh. Seeding default admin credentials...');
      const adminHashed = await bcrypt.hash('admin123', 10);
      
      // Standard admin
      await db.execute({
        sql: 'INSERT INTO users (id, username, password, email) VALUES (?, ?, ?, ?)',
        args: ['user_admin', 'admin', adminHashed, 'rajaricetraders01@gmail.com']
      });

      // Email admin
      await db.execute({
        sql: 'INSERT INTO users (id, username, password, email) VALUES (?, ?, ?, ?)',
        args: ['user_admin_gmail', 'rajaricetraders01@gmail.com', adminHashed, 'rajaricetraders01@gmail.com']
      });

      console.log('✅ Default admin accounts created successfully.');
    }

    // 3. Auto-Seed Products if empty
    const productsCountRes = await db.execute('SELECT COUNT(*) as count FROM products');
    const productsCount = productsCountRes.rows[0].count;
    if (productsCount === 0) {
      console.log('🌱 Seeding initial products catalog...');
      const defaultProducts = [
        {
          id: "prod_1",
          name: "Sona Masoori Rice",
          description: "Premium lightweight and aromatic grain, perfect for daily consumption and rich in taste.",
          category: "Premium",
          price: 65,
          packageSizes: JSON.stringify(["5kg", "10kg", "25kg", "50kg"]),
          imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
          inStock: 1,
          stockQuantity: 1500
        },
        {
          id: "prod_2",
          name: "BPT Rice",
          description: "Delicate texture and superb cooking quality, preferred by families for its premium quality.",
          category: "Premium",
          price: 70,
          packageSizes: JSON.stringify(["10kg", "25kg", "50kg"]),
          imageUrl: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&q=80&w=600",
          inStock: 1,
          stockQuantity: 1200
        },
        {
          id: "prod_3",
          name: "Steam Rice",
          description: "Steam-processed high quality rice, ideal for catering, restaurants, and long storage.",
          category: "Standard",
          price: 55,
          packageSizes: JSON.stringify(["25kg", "50kg"]),
          imageUrl: "https://images.unsplash.com/photo-1591821099449-74c0c1170757?auto=format&fit=crop&q=80&w=600",
          inStock: 1,
          stockQuantity: 2000
        },
        {
          id: "prod_4",
          name: "Raw Rice",
          description: "Traditionally milled raw rice, ideal for making traditional South Indian delicacies.",
          category: "Standard",
          price: 52,
          packageSizes: JSON.stringify(["25kg", "50kg"]),
          imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
          inStock: 1,
          stockQuantity: 900
        },
        {
          id: "prod_5",
          name: "Basmati Rice",
          description: "Extra long slender grains with rich aroma, aged to perfection for biryanis and special occasions.",
          category: "Super Premium",
          price: 130,
          packageSizes: JSON.stringify(["5kg", "10kg", "25kg"]),
          imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
          inStock: 1,
          stockQuantity: 500
        },
        {
          id: "prod_6",
          name: "Broken Rice",
          description: "Nutritious and clean broken rice, perfect for idli/dosa batters or porridge preparation.",
          category: "Economy",
          price: 35,
          packageSizes: JSON.stringify(["25kg", "50kg"]),
          imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600",
          inStock: 1,
          stockQuantity: 3000
        }
      ];

      for (const prod of defaultProducts) {
        await db.execute({
          sql: 'INSERT INTO products (id, name, description, category, price, packageSizes, imageUrl, inStock, stockQuantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          args: [prod.id, prod.name, prod.description, prod.category, prod.price, prod.packageSizes, prod.imageUrl, prod.inStock, prod.stockQuantity]
        });
      }
      console.log('✅ Default products catalog seeded successfully.');
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    // Do not call process.exit(1) — this would crash the Vercel serverless function
  }
};

module.exports = {
  db,
  connectDB
};
