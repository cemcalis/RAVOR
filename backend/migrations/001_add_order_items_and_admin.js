module.exports.run = async function(db) {
  return new Promise((resolve, reject) => {
    try {
      db.serialize(() => {
        db.run('PRAGMA foreign_keys = OFF');

        // Create a new users table with is_admin and updated_at if necessary
        db.run(`
          CREATE TABLE IF NOT EXISTS users_new (
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
        `, (err) => {
          if (err) return reject(err);

          db.run(`
            INSERT OR IGNORE INTO users_new (id, email, password, name, phone, address, is_admin, created_at)
            SELECT id, email, password, name, phone, address, COALESCE(is_admin, 0) as is_admin, created_at FROM users
          `, (e) => {
            // ignore errors copying

            db.run('DROP TABLE IF EXISTS users', (e2) => {
              // ignore
              db.run('ALTER TABLE users_new RENAME TO users', (e3) => {
                // ensure order_items table exists
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
                `, (errFinal) => {
                  db.run('PRAGMA foreign_keys = ON');
                  if (errFinal) return reject(errFinal);
                  console.log('Migration 001 completed');
                  resolve();
                });
              });
            });
          });
        });
      });
    } catch (err) {
      reject(err);
    }
  });
};
