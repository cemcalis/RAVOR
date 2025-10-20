module.exports.run = async function(db) {
  return new Promise((resolve, reject) => {
    try {
      db.all("PRAGMA table_info(products)", (err, cols) => {
        if (err) return reject(err);
        const names = (cols || []).map(c => c.name);
        if (!names.includes('updated_at')) {
          db.run('ALTER TABLE products ADD COLUMN updated_at DATETIME', (e) => e ? reject(e) : resolve());
        } else {
          resolve();
        }
      });
    } catch (e) { reject(e); }
  });
};
