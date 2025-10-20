const request = require('supertest');
const app = require('../server');
const db = require('../db');
const bcrypt = require('bcrypt');

describe('Admin management routes', () => {
  let adminToken;
  let newUserId;

  beforeAll(async () => {
    // Ensure admin user exists and get token
    const email = process.env.ADMIN_EMAIL || 'admin@aura.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123admin';

    // Hash password and upsert admin
    const hashed = await bcrypt.hash(password, 10);
    await new Promise((res, rej) => {
      db.run(`INSERT OR REPLACE INTO users (id, email, password, name, is_admin) VALUES ((SELECT id FROM users WHERE email = ?), ?, ?, ?, 1)`, [email, email, hashed, 'Test Admin'], (err) => {
        if (err) rej(err); else res();
      });
    });

    const loginRes = await request(app)
      .post('/api/admin/auth/login')
      .send({ email, password });

    expect(loginRes.status).toBe(200);
    adminToken = loginRes.body.token;
  });

  afterAll(() => {
    // no-op, DB is file-based
  });

  test('creates a user, promotes to admin, and lists users', async () => {
    // Create user directly in DB (idempotent)
    const hashed = await bcrypt.hash('userpass', 10);
    await new Promise((res, rej) => {
      db.run('INSERT OR IGNORE INTO users (email, password, name) VALUES (?, ?, ?)', ['tempuser@example.com', hashed, 'Temp User'], function(err) {
        if (err) rej(err); else res();
      });
    });
    const result = await new Promise((res, rej) => db.get('SELECT id FROM users WHERE email = ?', ['tempuser@example.com'], (err, row) => err ? rej(err) : res(row)));
    newUserId = result.id;

    // Promote via API
    const promoteRes = await request(app)
      .post('/api/admin-management/promote')
      .set('Authorization', 'Bearer ' + adminToken)
      .send({ userId: newUserId });

    expect(promoteRes.status).toBe(200);
    expect(promoteRes.body.success).toBe(true);

    // Verify user is admin
    const user = await new Promise((res, rej) => db.get('SELECT is_admin FROM users WHERE id = ?', [newUserId], (err, row) => err ? rej(err) : res(row)));
    expect(user.is_admin).toBe(1);

    // List users
    const listRes = await request(app)
      .get('/api/admin-management')
      .set('Authorization', 'Bearer ' + adminToken);

    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body.data)).toBe(true);
  });
});
