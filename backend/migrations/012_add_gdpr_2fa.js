// Migration: Add GDPR and 2FA features
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../database/store.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  console.log('Running migration 012: GDPR and 2FA features...');

  // Add 2FA fields to users
  db.run(`
    ALTER TABLE users ADD COLUMN two_factor_enabled BOOLEAN DEFAULT 0
  `, (err) => {
    if (err && !/duplicate column/i.test(err.message)) {
      console.error('Error adding users.two_factor_enabled:', err.message);
    } else {
      console.log('✅ users.two_factor_enabled column added');
    }
  });

  db.run(`
    ALTER TABLE users ADD COLUMN two_factor_secret TEXT
  `, (err) => {
    if (err && !/duplicate column/i.test(err.message)) {
      console.error('Error adding users.two_factor_secret:', err.message);
    } else {
      console.log('✅ users.two_factor_secret column added');
    }
  });

  // Add GDPR consent tracking
  db.run(`
    ALTER TABLE users ADD COLUMN gdpr_consent BOOLEAN DEFAULT 0
  `, (err) => {
    if (err && !/duplicate column/i.test(err.message)) {
      console.error('Error adding users.gdpr_consent:', err.message);
    } else {
      console.log('✅ users.gdpr_consent column added');
    }
  });

  db.run(`
    ALTER TABLE users ADD COLUMN gdpr_consent_date DATETIME
  `, (err) => {
    if (err && !/duplicate column/i.test(err.message)) {
      console.error('Error adding users.gdpr_consent_date:', err.message);
    } else {
      console.log('✅ users.gdpr_consent_date column added');
    }
  });

  db.run(`
    ALTER TABLE users ADD COLUMN marketing_consent BOOLEAN DEFAULT 0
  `, (err) => {
    if (err && !/duplicate column/i.test(err.message)) {
      console.error('Error adding users.marketing_consent:', err.message);
    } else {
      console.log('✅ users.marketing_consent column added');
    }
  });

  // Data export requests
  db.run(`
    CREATE TABLE IF NOT EXISTS data_export_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      export_data TEXT,
      requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Error creating data_export_requests table:', err.message);
    } else {
      console.log('✅ data_export_requests table created');
    }
  });

  // Account deletion requests
  db.run(`
    CREATE TABLE IF NOT EXISTS account_deletion_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      status TEXT DEFAULT 'pending',
      reason TEXT,
      requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      scheduled_deletion_at DATETIME,
      completed_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Error creating account_deletion_requests table:', err.message);
    } else {
      console.log('✅ account_deletion_requests table created');
    }
  });

  // Cookie consent tracking
  db.run(`
    CREATE TABLE IF NOT EXISTS cookie_consents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT,
      user_id INTEGER,
      essential BOOLEAN DEFAULT 1,
      analytics BOOLEAN DEFAULT 0,
      marketing BOOLEAN DEFAULT 0,
      preferences BOOLEAN DEFAULT 0,
      ip_address TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating cookie_consents table:', err.message);
    } else {
      console.log('✅ cookie_consents table created');
    }
  });

  // Audit log for sensitive operations
  db.run(`
    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      entity_type TEXT,
      entity_id INTEGER,
      changes TEXT,
      ip_address TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating audit_logs table:', err.message);
    } else {
      console.log('✅ audit_logs table created');
    }
  });

  console.log('Migration 012 completed');
});

db.close();
