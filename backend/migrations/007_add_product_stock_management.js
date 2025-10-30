// Migration: Add stock management improvements
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../database/store.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log('Running migration 007: Stock management improvements...');

  // Add stock column to products table if not exists
  db.run(`
    ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 0
  `, (err) => {
    if (err && !/duplicate column/i.test(err.message)) {
      console.error('Error adding products.stock:', err.message);
    } else {
      console.log('✅ products.stock column added');
    }
  });

  // Add low_stock_threshold for alerts
  db.run(`
    ALTER TABLE products ADD COLUMN low_stock_threshold INTEGER DEFAULT 5
  `, (err) => {
    if (err && !/duplicate column/i.test(err.message)) {
      console.error('Error adding products.low_stock_threshold:', err.message);
    } else {
      console.log('✅ products.low_stock_threshold column added');
    }
  });

  // Add stock_alert_enabled flag
  db.run(`
    ALTER TABLE products ADD COLUMN stock_alert_enabled BOOLEAN DEFAULT 1
  `, (err) => {
    if (err && !/duplicate column/i.test(err.message)) {
      console.error('Error adding products.stock_alert_enabled:', err.message);
    } else {
      console.log('✅ products.stock_alert_enabled column added');
    }
  });

  // Create stock_alerts table for notifications
  db.run(`
    CREATE TABLE IF NOT EXISTS stock_alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER,
      variant_id INTEGER,
      user_email TEXT NOT NULL,
      notified BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (variant_id) REFERENCES variants(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Error creating stock_alerts table:', err.message);
    } else {
      console.log('✅ stock_alerts table created');
    }
  });

  // Add cancellation_reason to orders
  db.run(`
    ALTER TABLE orders ADD COLUMN cancellation_reason TEXT
  `, (err) => {
    if (err && !/duplicate column/i.test(err.message)) {
      console.error('Error adding orders.cancellation_reason:', err.message);
    } else {
      console.log('✅ orders.cancellation_reason column added');
    }
  });

  // Add cancelled_at timestamp
  db.run(`
    ALTER TABLE orders ADD COLUMN cancelled_at DATETIME
  `, (err) => {
    if (err && !/duplicate column/i.test(err.message)) {
      console.error('Error adding orders.cancelled_at:', err.message);
    } else {
      console.log('✅ orders.cancelled_at column added');
    }
  });

  console.log('Migration 007 completed');
});

db.close();
