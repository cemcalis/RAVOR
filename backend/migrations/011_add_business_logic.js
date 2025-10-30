// Migration: Add business logic features - coupons, shipping, CMS
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../database/store.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log('Running migration 011: Business logic features...');

  // Coupons/Discounts table
  db.run(`
    CREATE TABLE IF NOT EXISTS coupons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      type TEXT NOT NULL,
      value REAL NOT NULL,
      min_purchase REAL DEFAULT 0,
      max_discount REAL,
      usage_limit INTEGER,
      usage_count INTEGER DEFAULT 0,
      user_limit INTEGER DEFAULT 1,
      valid_from DATETIME DEFAULT CURRENT_TIMESTAMP,
      valid_until DATETIME,
      is_active BOOLEAN DEFAULT 1,
      applicable_categories TEXT,
      applicable_products TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating coupons table:', err.message);
    } else {
      console.log('✅ coupons table created');
    }
  });

  // Coupon usage tracking
  db.run(`
    CREATE TABLE IF NOT EXISTS coupon_usage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      coupon_id INTEGER NOT NULL,
      user_id INTEGER,
      order_id INTEGER,
      discount_amount REAL NOT NULL,
      used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating coupon_usage table:', err.message);
    } else {
      console.log('✅ coupon_usage table created');
    }
  });

  // Add discount fields to orders
  db.run(`
    ALTER TABLE orders ADD COLUMN coupon_code TEXT
  `, (err) => {
    if (err && !/duplicate column/i.test(err.message)) {
      console.error('Error adding orders.coupon_code:', err.message);
    } else {
      console.log('✅ orders.coupon_code column added');
    }
  });

  db.run(`
    ALTER TABLE orders ADD COLUMN discount_amount REAL DEFAULT 0
  `, (err) => {
    if (err && !/duplicate column/i.test(err.message)) {
      console.error('Error adding orders.discount_amount:', err.message);
    } else {
      console.log('✅ orders.discount_amount column added');
    }
  });

  db.run(`
    ALTER TABLE orders ADD COLUMN shipping_cost REAL DEFAULT 0
  `, (err) => {
    if (err && !/duplicate column/i.test(err.message)) {
      console.error('Error adding orders.shipping_cost:', err.message);
    } else {
      console.log('✅ orders.shipping_cost column added');
    }
  });

  db.run(`
    ALTER TABLE orders ADD COLUMN subtotal REAL DEFAULT 0
  `, (err) => {
    if (err && !/duplicate column/i.test(err.message)) {
      console.error('Error adding orders.subtotal:', err.message);
    } else {
      console.log('✅ orders.subtotal column added');
    }
  });

  // Shipping zones and rates
  db.run(`
    CREATE TABLE IF NOT EXISTS shipping_zones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      countries TEXT NOT NULL,
      cities TEXT,
      base_rate REAL NOT NULL,
      free_shipping_threshold REAL,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating shipping_zones table:', err.message);
    } else {
      console.log('✅ shipping_zones table created');
    }
  });

  // CMS - Pages
  db.run(`
    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      meta_title TEXT,
      meta_description TEXT,
      is_published BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating pages table:', err.message);
    } else {
      console.log('✅ pages table created');
    }
  });

  // Banners/Sliders
  db.run(`
    CREATE TABLE IF NOT EXISTS banners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      image_url TEXT NOT NULL,
      link_url TEXT,
      description TEXT,
      position TEXT DEFAULT 'home',
      display_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      valid_from DATETIME DEFAULT CURRENT_TIMESTAMP,
      valid_until DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating banners table:', err.message);
    } else {
      console.log('✅ banners table created');
    }
  });

  // Newsletter subscriptions
  db.run(`
    CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      is_active BOOLEAN DEFAULT 1,
      subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      unsubscribed_at DATETIME
    )
  `, (err) => {
    if (err) {
      console.error('Error creating newsletter_subscriptions table:', err.message);
    } else {
      console.log('✅ newsletter_subscriptions table created');
    }
  });

  console.log('Migration 011 completed');
});

db.close();
