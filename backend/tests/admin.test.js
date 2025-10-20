const request = require('supertest');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const app = require('../server');

describe('Admin flows', () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@aura.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe!Please-SetEnv';
  let token;
  const db = require('../db');

  beforeAll(async () => {
    // ensure admin exists with known password
    const bcrypt = require('bcrypt');
    const hashed = await bcrypt.hash(adminPassword, 10);
    await new Promise((resolve, reject) => {
      db.run('INSERT OR REPLACE INTO users (id, email, password, name, is_admin) VALUES ((SELECT id FROM users WHERE email = ?), ?, ?, ?, 1)', [adminEmail, adminEmail, hashed, 'Admin'], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });

  test('Admin login should return token', async () => {
    const res = await request(app)
      .post('/api/admin/auth/login')
      .send({ email: adminEmail, password: adminPassword })
      .expect(200);

    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  test('Promote user requires token and works', async () => {
    // Create a demo user
    const db = require('../db');
    const email = `testuser_${Date.now()}@example.com`;
    const name = 'Test User';
    const password = 'password123';
    const bcrypt = require('bcrypt');
    const hashed = await bcrypt.hash(password, 10);

    let userId;
    await new Promise((resolve, reject) => {
      db.run('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', [email, hashed, name], function(err) {
        if (err) reject(err);
        else { userId = this.lastID; resolve(); }
      });
    });

    // Promote
    const res = await request(app)
      .post('/api/admin-management/promote')
      .set('Authorization', `Bearer ${token}`)
      .send({ userId })
      .expect(200);

    expect(res.body.success).toBe(true);
  });

  afterAll(async () => {
    // close sqlite db to prevent open handles
    const dbClose = require('../db');
    if (dbClose && dbClose.close) dbClose.close();
  });
});
