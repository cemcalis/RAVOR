const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', '..', 'database', 'store.db');
console.log('Using DB path:', dbPath);
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Failed to open DB:', err.message);
    process.exit(1);
  }
});

function all(sql, params = []) {
  return new Promise((resolve, reject) => db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows)));
}

(async () => {
  try {
    const admin = await all('SELECT id, email, is_admin, created_at FROM users WHERE email = ?', ['admin@aura.com']);
    console.log('\n=== admin query result ===');
    console.log(admin.length ? admin : 'no admin with email admin@aura.com');

    const sample = await all('SELECT id, email, is_admin, created_at FROM users LIMIT 10');
    console.log('\n=== users sample (up to 10) ===');
    console.table(sample);

    const usersSchema = await all("PRAGMA table_info(users)");
    console.log('\n=== users schema ===');
    console.table(usersSchema);

    const ordersSchema = await all("PRAGMA table_info(orders)");
    console.log('\n=== orders schema ===');
    console.table(ordersSchema);

    const oiSchema = await all("PRAGMA table_info(order_items)");
    console.log('\n=== order_items schema ===');
    console.table(oiSchema);

  } catch (e) {
    console.error('ERROR:', e);
  } finally {
    db.close();
  }
})();
