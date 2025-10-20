module.exports.run = async function(db) {
  return new Promise((resolve, reject) => {
    db.all("PRAGMA table_info(orders)", (err, cols) => {
      if (err) return reject(err);
      const names = (cols || []).map(c => c.name);
      if (!names.includes('payment_method')) {
        db.run('ALTER TABLE orders ADD COLUMN payment_method TEXT', (e) => {
          if (e) return reject(e);
          resolve();
        });
      } else {
        resolve();
      }
    });
  });
};
