const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database', 'store.db');
const db = new sqlite3.Database(dbPath);

function ensureMigrationsTable() {
  return new Promise((resolve, reject) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => err ? reject(err) : resolve());
  });
}

function getAppliedMigrations() {
  return new Promise((resolve, reject) => {
    db.all('SELECT name FROM migrations', (err, rows) => {
      if (err) return reject(err);
      resolve(new Set((rows || []).map(r => r.name)));
    });
  });
}

function applyMigration(filename) {
  return new Promise(async (resolve, reject) => {
    try {
      const filePath = path.join(__dirname, 'migrations', filename);
      if (!fs.existsSync(filePath)) return resolve();

      if (filename.endsWith('.sql')) {
        const sql = fs.readFileSync(filePath, 'utf8');
        db.exec(sql, (err) => {
          if (err) return reject(err);
          db.run('INSERT OR IGNORE INTO migrations (name) VALUES (?)', [filename], (e) => e ? reject(e) : resolve());
        });
      } else if (filename.endsWith('.js')) {
        // Require the migration module. If it exports a `run` function, call it with the db.
        const mig = require(path.join(__dirname, 'migrations', filename));
        if (mig && typeof mig.run === 'function') {
          // Allow run to return a promise
          await mig.run(db);
        }
        // If the module executed on require that's fine too.
        db.run('INSERT OR IGNORE INTO migrations (name) VALUES (?)', [filename], (e) => e ? reject(e) : resolve());
      } else {
        // Unknown file type: skip
        return resolve();
      }
    } catch (e) {
      return reject(e);
    }
  });
}

async function run() {
  try {
    await ensureMigrationsTable();
    const applied = await getAppliedMigrations();
    const dir = path.join(__dirname, 'migrations');
    const files = fs.existsSync(dir) ? fs.readdirSync(dir).sort() : [];
    for (const f of files) {
      if (!applied.has(f)) {
        console.log('Applying migration', f);
        await applyMigration(f);
        console.log('Applied', f);
      }
    }
    console.log('Migrations complete');
    db.close();
  } catch (e) {
    console.error('Migration error', e);
    db.close();
    process.exit(1);
  }
}

if (require.main === module) run();

module.exports = { run };
