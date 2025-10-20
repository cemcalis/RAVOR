module.exports.run = async function(db) {
  return new Promise((resolve, reject) => {
    try {
      db.all("PRAGMA table_info(users)", (err, cols) => {
        if (err) return reject(err);
        const names = (cols || []).map(c => c.name);
        const tasks = [];
        if (!names.includes('is_admin')) {
          tasks.push(cb => db.run('ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT 0', cb));
        }
        if (!names.includes('updated_at')) {
          tasks.push(cb => db.run('ALTER TABLE users ADD COLUMN updated_at DATETIME', cb));
        }

        // Run tasks sequentially
        const runNext = () => {
          const fn = tasks.shift();
          if (!fn) return resolve();
          fn((e) => { if (e) return reject(e); runNext(); });
        };
        runNext();
      });
    } catch (e) { reject(e); }
  });
};
