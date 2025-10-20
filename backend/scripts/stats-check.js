const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, '..', '..', 'database', 'store.db');
const db = new sqlite3.Database(dbPath);

function run(sql, params=[]) { return new Promise((res, rej)=> db.get(sql, params, (e,r)=> e?rej(e):res(r))); }
function all(sql, params=[]) { return new Promise((res, rej)=> db.all(sql, params, (e,r)=> e?rej(e):res(r))); }

(async ()=>{
  try{
    const totalProducts = await run('SELECT COUNT(*) as count FROM products');
    console.log('totalProducts', totalProducts);
    const totalOrders = await run('SELECT COUNT(*) as count FROM orders');
    console.log('totalOrders', totalOrders);
    const totalUsers = await run('SELECT COUNT(*) as count FROM users');
    console.log('totalUsers', totalUsers);
    const totalRevenue = await run('SELECT SUM(total_amount) as sum FROM orders WHERE status = "completed"');
    console.log('totalRevenue', totalRevenue);
    const recentOrders = await all(`SELECT o.*, u.name as customerName FROM orders o LEFT JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC LIMIT 5`);
    console.log('recentOrders', recentOrders);
  }catch(e){
    console.error('stats check error', e);
  }finally{ db.close(); }
})();
