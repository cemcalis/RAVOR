const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '../database');
fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, 'store.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Veritabanı bağlantı hatası:', err.message);
  } else {
    console.log('✅ SQLite veritabanına bağlandı:', dbPath);
    initDatabase();
  }
});

function initDatabase() {
  db.serialize(() => {
    // Kategoriler
    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Ürünler
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        compare_price REAL,
        category_id INTEGER,
        image_url TEXT,
        images TEXT,
        stock_status TEXT DEFAULT 'in_stock',
        is_featured BOOLEAN DEFAULT 0,
        is_new BOOLEAN DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      )
    `);

    // Varyantlar (beden/renk)
    db.run(`
      CREATE TABLE IF NOT EXISTS variants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        size TEXT,
        color TEXT,
        stock INTEGER DEFAULT 0,
        sku TEXT,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    // Kullanıcılar
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        is_admin BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Siparişler
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT,
        shipping_address TEXT NOT NULL,
        total_amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Sipariş öğeleri
    db.run(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER,
        variant_id INTEGER,
        quantity INTEGER DEFAULT 1,
        price REAL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);

    // Ürün yorumları
    db.run(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER NOT NULL,
        user_id INTEGER,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT NOT NULL,
        is_approved BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // Favoriler
    db.run(`
      CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        UNIQUE(user_id, product_id)
      )
    `);

    // Sepet (session-based)
    db.run(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id TEXT NOT NULL,
        product_id INTEGER NOT NULL,
        variant_id INTEGER,
        quantity INTEGER DEFAULT 1,
        price REAL NOT NULL,
        name TEXT NOT NULL,
        image_url TEXT,
        size TEXT,
        color TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (variant_id) REFERENCES variants(id) ON DELETE SET NULL
      )
    `);

    console.log('✅ Veritabanı tabloları hazır');
    // Runtime migrations: ensure users table has is_admin and updated_at columns
    db.all("PRAGMA table_info(users)", (err, cols) => {
      if (err) {
        // users table might not exist yet
        return;
      }

      const colNames = (cols || []).map(c => c.name);
      if (!colNames.includes('is_admin')) {
        db.run('ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT 0', (alterErr) => {
          if (alterErr && !/duplicate column/i.test(alterErr.message)) {
            console.error('users.is_admin eklenemedi:', alterErr.message);
          } else {
            console.log('✅ users.is_admin sütunu eklendi');
          }
        });
      }

      if (!colNames.includes('updated_at')) {
        db.run('ALTER TABLE users ADD COLUMN updated_at DATETIME', (alterErr) => {
          if (alterErr && !/duplicate column/i.test(alterErr.message)) {
            console.error('users.updated_at eklenemedi:', alterErr.message);
            return;
          }
          db.run(
            "UPDATE users SET updated_at = COALESCE(updated_at, created_at)",
            (updateErr) => {
              if (updateErr) {
                console.error('users.updated_at doldurulamadı:', updateErr.message);
              } else {
                console.log('✅ users.updated_at sütunu eklendi ve dolduruldu');
              }
            }
          );
        });
      }
    });
    // Ensure categories.updated_at exists
    db.all("PRAGMA table_info(categories)", (err, cols) => {
      if (err) return;
      const colNames = (cols || []).map(c => c.name);
      if (!colNames.includes('updated_at')) {
        db.run('ALTER TABLE categories ADD COLUMN updated_at DATETIME', (alterErr) => {
          if (alterErr && !/duplicate column/i.test(alterErr.message)) {
            console.error('categories.updated_at eklenemedi:', alterErr.message);
            return;
          }
          db.run(
            "UPDATE categories SET updated_at = COALESCE(updated_at, created_at)",
            (updateErr) => {
              if (updateErr) {
                console.error('categories.updated_at doldurulamadı:', updateErr.message);
              } else {
                console.log('✅ categories.updated_at sütunu eklendi ve dolduruldu');
              }
            }
          );
        });
      }
    });

// Ensure products.is_active exists
    db.all("PRAGMA table_info(products)", (err, cols) => {
      if (err) return;
      const colNames = (cols || []).map(c => c.name);
      if (!colNames.includes('is_active')) {
        db.run('ALTER TABLE products ADD COLUMN is_active BOOLEAN DEFAULT 1', (alterErr) => {
          if (alterErr && !/duplicate column/i.test(alterErr.message)) {
            console.error('products.is_active eklenemedi:', alterErr.message);
          } else {
            console.log('✅ products.is_active sütunu eklendi');
          }
        });
      }
    });
    db.all("PRAGMA table_info(orders)", (err, cols) => {
      if (err) return;
      const colNames = (cols || []).map(c => c.name);
      if (!colNames.includes('updated_at')) {
        db.run('ALTER TABLE orders ADD COLUMN updated_at DATETIME', (alterErr) => {
          if (alterErr && !/duplicate column/i.test(alterErr.message)) {
            console.error('orders.updated_at eklenemedi:', alterErr.message);
            return;
          }
          db.run(
            "UPDATE orders SET updated_at = COALESCE(updated_at, created_at)",
            (updateErr) => {
              if (updateErr) {
                console.error('orders.updated_at doldurulamadı:', updateErr.message);
              } else {
                console.log('✅ orders.updated_at sütunu eklendi ve dolduruldu');
              }
            }
          );
        });
      }
      // Ensure orders.user_id exists (older DBs might lack this column)
      if (!colNames.includes('user_id')) {
        db.run('ALTER TABLE orders ADD COLUMN user_id INTEGER', (alterErr) => {
          if (alterErr && !/duplicate column/i.test(alterErr.message)) {
            console.error('orders.user_id eklenemedi:', alterErr.message);
          } else {
            console.log('✅ orders.user_id sütunu eklendi');
          }
        });
      }
    });
    // Ensure products.is_active exists
    db.all("PRAGMA table_info(products)", (err, cols) => {
      if (err) return;
      const colNames = (cols || []).map(c => c.name);
      if (!colNames.includes('is_active')) {
        db.run('ALTER TABLE products ADD COLUMN is_active BOOLEAN DEFAULT 1', (alterErr) => {
          if (alterErr && !/duplicate column/i.test(alterErr.message)) {
            console.error('products.is_active eklenemedi:', alterErr.message);
          } else {
            console.log('✅ products.is_active sütunu eklendi');
          }
        });
      }
    });
  });
}

module.exports = db;