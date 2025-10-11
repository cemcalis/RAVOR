const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database/store.db');
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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
        product_id INTEGER NOT NULL,
        variant_id INTEGER,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);

    console.log('✅ Veritabanı tabloları hazır');
  });
}

module.exports = db;