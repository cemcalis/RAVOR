const db = require('sqlite3').verbose();
const dbConn = new db.Database('../database/store.db');

console.log('Checking database tables...');

dbConn.get('SELECT COUNT(*) as products FROM products', (err, row) => {
  if(err) console.error('Products error:', err);
  else console.log('Total products:', row.products);
});

dbConn.get('SELECT COUNT(*) as orders FROM orders', (err, row) => {
  if(err) console.error('Orders error:', err);
  else console.log('Total orders:', row.orders);
});

dbConn.get('SELECT COUNT(*) as users FROM users', (err, row) => {
  if(err) console.error('Users error:', err);
  else console.log('Total users:', row.users);
});

dbConn.get('SELECT SUM(total_amount) as revenue FROM orders WHERE status = "completed"', (err, row) => {
  if(err) console.error('Revenue error:', err);
  else console.log('Total revenue:', row.revenue || 0);
  dbConn.close();
});