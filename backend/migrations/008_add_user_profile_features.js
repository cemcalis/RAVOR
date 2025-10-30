// Migration: Add user profile features - profile picture, multiple addresses, password reset
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../database/store.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log('Running migration 008: User profile features...');

  // Add profile_picture to users table
  db.run(`
    ALTER TABLE users ADD COLUMN profile_picture TEXT
  `, (err) => {
    if (err && !/duplicate column/i.test(err.message)) {
      console.error('Error adding users.profile_picture:', err.message);
    } else {
      console.log('✅ users.profile_picture column added');
    }
  });

  // Add reset_token and reset_token_expires for password reset
  db.run(`
    ALTER TABLE users ADD COLUMN reset_token TEXT
  `, (err) => {
    if (err && !/duplicate column/i.test(err.message)) {
      console.error('Error adding users.reset_token:', err.message);
    } else {
      console.log('✅ users.reset_token column added');
    }
  });

  db.run(`
    ALTER TABLE users ADD COLUMN reset_token_expires DATETIME
  `, (err) => {
    if (err && !/duplicate column/i.test(err.message)) {
      console.error('Error adding users.reset_token_expires:', err.message);
    } else {
      console.log('✅ users.reset_token_expires column added');
    }
  });

  // Create addresses table for multiple shipping addresses
  db.run(`
    CREATE TABLE IF NOT EXISTS addresses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT,
      full_name TEXT NOT NULL,
      phone TEXT,
      address_line1 TEXT NOT NULL,
      address_line2 TEXT,
      city TEXT NOT NULL,
      state TEXT,
      postal_code TEXT NOT NULL,
      country TEXT DEFAULT 'Türkiye',
      is_default BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Error creating addresses table:', err.message);
    } else {
      console.log('✅ addresses table created');
    }
  });

  // Create password_reset_requests table for tracking reset attempts
  db.run(`
    CREATE TABLE IF NOT EXISTS password_reset_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      token TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      used BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating password_reset_requests table:', err.message);
    } else {
      console.log('✅ password_reset_requests table created');
    }
  });

  console.log('Migration 008 completed');
});

db.close();
