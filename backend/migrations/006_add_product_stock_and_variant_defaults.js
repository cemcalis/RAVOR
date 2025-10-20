module.exports.run = async function(db) {
  // Add products.stock if missing
  await new Promise((resolve, reject) => {
    db.all("PRAGMA table_info(products)", (err, cols) => {
      if (err) return reject(err);
      const names = (cols || []).map(c => c.name);
      if (!names.includes('stock')) {
        try {
          db.run('ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 0', (e) => {
            if (e) return reject(e);
            // Backfill existing rows
            db.run('UPDATE products SET stock = 0 WHERE stock IS NULL', (uErr) => uErr ? reject(uErr) : resolve());
          });
        } catch (e) {
          return reject(e);
        }
      } else {
        resolve();
      }
    });
  });

  // Ensure variants.stock exists and default is not NULL (can't ALTER default, but ensure not null values)
  await new Promise((resolve, reject) => {
    db.all("PRAGMA table_info(variants)", (err, cols) => {
      if (err) return reject(err);
      const names = (cols || []).map(c => c.name);
      if (!names.includes('stock')) {
        try {
          db.run('ALTER TABLE variants ADD COLUMN stock INTEGER DEFAULT 0', (e) => {
            if (e) return reject(e);
            db.run('UPDATE variants SET stock = 0 WHERE stock IS NULL', (uErr) => uErr ? reject(uErr) : resolve());
          });
        } catch (e) {
          return reject(e);
        }
      } else {
        // Backfill nulls to 0
        db.run('UPDATE variants SET stock = 0 WHERE stock IS NULL', (uErr) => uErr ? reject(uErr) : resolve());
      }
    });
  });
};
