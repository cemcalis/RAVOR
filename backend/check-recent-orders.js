const db = require('sqlite3').verbose();
const dbConn = new db.Database('../database/store.db');

console.log('Checking recent orders...');

dbConn.all(`
  SELECT o.*, u.name as customerName
  FROM orders o
  LEFT JOIN users u ON o.user_id = u.id
  ORDER BY o.created_at DESC
  LIMIT 5
`, (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Recent orders:');
    rows.forEach(order => {
      console.log(`- Order #${order.id}: ${order.customerName || 'Unknown'} - ₺${order.total_amount} - Status: ${order.status}`);
    });
  }
  dbConn.close();
});