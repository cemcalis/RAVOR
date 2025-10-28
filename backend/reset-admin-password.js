const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const db = require('./db');

// Usage: node reset-admin-password.js [email] [newPassword]
const email = process.argv[2] || process.env.ADMIN_EMAIL || 'admin@ravor.com';
const newPassword = process.argv[3] || process.env.ADMIN_PASSWORD || 'admin123admin';

async function run() {
  try {
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error('DB error:', err);
        process.exit(1);
      }

      if (!user) {
        console.error('Admin user not found for email:', email);
        process.exit(1);
      }

      // Backup row
      const backupDir = path.join(__dirname, 'backups');
      fs.mkdirSync(backupDir, { recursive: true });
      const backupPath = path.join(backupDir, `user-${user.id}-${Date.now()}.json`);
      fs.writeFileSync(backupPath, JSON.stringify(user, null, 2));
      console.log('Backed up user row to', backupPath);

      // Hash new password
      const hash = await bcrypt.hash(newPassword, 10);

      db.run('UPDATE users SET password = ? WHERE id = ?', [hash, user.id], function (updateErr) {
        if (updateErr) {
          console.error('Failed to update password:', updateErr);
          process.exit(1);
        }

        console.log(`Password for ${email} updated successfully (id=${user.id}).`);
        // Close DB connection and exit
        db.close(() => process.exit(0));
      });
    });
  } catch (e) {
    console.error('Unexpected error:', e);
    process.exit(1);
  }
}

run();
