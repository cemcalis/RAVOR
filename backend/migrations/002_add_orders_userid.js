module.exports.run = async function(db) {
  return new Promise((resolve, reject) => {
    try {
      db.all("PRAGMA table_info(orders)", (err, cols) => {
        if (err) return reject(err);
        const names = (cols || []).map(c => c.name);
        if (!names.includes('user_id')) {
          db.run('ALTER TABLE orders ADD COLUMN user_id INTEGER', (e) => e ? reject(e) : resolve());
        } else {
          resolve();
        }
      });
    } catch (e) { reject(e); }
  });
};
