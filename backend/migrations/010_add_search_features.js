// Migration: Add search and filtering features
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../database/store.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log('Running migration 010: Search features...');

  // Create search_history table for tracking searches
  db.run(`
    CREATE TABLE IF NOT EXISTS search_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      session_id TEXT,
      query TEXT NOT NULL,
      results_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Error creating search_history table:', err.message);
    } else {
      console.log('✅ search_history table created');
    }
  });

  // Create search_suggestions table for popular searches
  db.run(`
    CREATE TABLE IF NOT EXISTS search_suggestions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      query TEXT UNIQUE NOT NULL,
      search_count INTEGER DEFAULT 1,
      last_searched DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating search_suggestions table:', err.message);
    } else {
      console.log('✅ search_suggestions table created');
    }
  });

  // Add color field to variants for color filtering
  db.run(`
    ALTER TABLE variants ADD COLUMN color_hex TEXT
  `, (err) => {
    if (err && !/duplicate column/i.test(err.message)) {
      console.error('Error adding variants.color_hex:', err.message);
    } else {
      console.log('✅ variants.color_hex column added');
    }
  });

  // Add material field to products
  db.run(`
    ALTER TABLE products ADD COLUMN material TEXT
  `, (err) => {
    if (err && !/duplicate column/i.test(err.message)) {
      console.error('Error adding products.material:', err.message);
    } else {
      console.log('✅ products.material column added');
    }
  });

  // Add season field to products
  db.run(`
    ALTER TABLE products ADD COLUMN season TEXT
  `, (err) => {
    if (err && !/duplicate column/i.test(err.message)) {
      console.error('Error adding products.season:', err.message);
    } else {
      console.log('✅ products.season column added');
    }
  });

  console.log('Migration 010 completed');
});

db.close();
