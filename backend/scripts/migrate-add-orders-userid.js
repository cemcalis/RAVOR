const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, '..', '..', 'database', 'store.db');
const db = new sqlite3.Database(dbPath);

function all(sql, params=[]) { return new Promise((res, rej)=> db.all(sql, params, (e,r)=> e?rej(e):res(r))); }
function run(sql, params=[]) { return new Promise((res, rej)=> db.run(sql, params, function(e){ e?rej(e):res(this); })); }

(async ()=>{
  try{
    const cols = await all("PRAGMA table_info(orders)");
    const colNames = cols.map(c => c.name);
    if (!colNames.includes('user_id')) {
      console.log('Adding orders.user_id column...');
      await run('ALTER TABLE orders ADD COLUMN user_id INTEGER');
      console.log('Done.');
    } else {
      console.log('orders.user_id already exists.');
    }
  }catch(e){
    console.error('Migration error', e);
  }finally{ db.close(); }
})();
