// Migration: Add product features - variant images, video support, comparison
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../database/store.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log('Running migration 009: Product features...');

  // Add image_url to variants for variant-specific images
  db.run(`
    ALTER TABLE variants ADD COLUMN image_url TEXT
  `, (err) => {
    if (err && !/duplicate column/i.test(err.message)) {
      console.error('Error adding variants.image_url:', err.message);
    } else {
      console.log('✅ variants.image_url column added');
    }
  });

  // Add video_url to products
  db.run(`
    ALTER TABLE products ADD COLUMN video_url TEXT
  `, (err) => {
    if (err && !/duplicate column/i.test(err.message)) {
      console.error('Error adding products.video_url:', err.message);
    } else {
      console.log('✅ products.video_url column added');
    }
  });

  // Add specifications JSON field for detailed product specs
  db.run(`
    ALTER TABLE products ADD COLUMN specifications TEXT
  `, (err) => {
    if (err && !/duplicate column/i.test(err.message)) {
      console.error('Error adding products.specifications:', err.message);
    } else {
      console.log('✅ products.specifications column added');
    }
  });

  // Add dimensions for shipping calculations
  db.run(`
    ALTER TABLE products ADD COLUMN weight REAL
  `, (err) => {
    if (err && !/duplicate column/i.test(err.message)) {
      console.error('Error adding products.weight:', err.message);
    } else {
      console.log('✅ products.weight column added');
    }
  });

  // Create product_comparisons table for user comparisons
  db.run(`
    CREATE TABLE IF NOT EXISTS product_comparisons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      session_id TEXT,
      product_ids TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Error creating product_comparisons table:', err.message);
    } else {
      console.log('✅ product_comparisons table created');
    }
  });

  // Create recently_viewed table for tracking user views
  db.run(`
    CREATE TABLE IF NOT EXISTS recently_viewed (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      session_id TEXT,
      product_id INTEGER NOT NULL,
      viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Error creating recently_viewed table:', err.message);
    } else {
      console.log('✅ recently_viewed table created');
    }
  });

  // Add tags field for better search and filtering
  db.run(`
    ALTER TABLE products ADD COLUMN tags TEXT
  `, (err) => {
    if (err && !/duplicate column/i.test(err.message)) {
      console.error('Error adding products.tags:', err.message);
    } else {
      console.log('✅ products.tags column added');
    }
  });

  console.log('Migration 009 completed');
});

db.close();
