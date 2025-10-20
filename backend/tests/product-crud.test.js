const request = require('supertest');
const app = require('../server');
const db = require('../db');
const bcrypt = require('bcrypt');

describe('Product CRUD', () => {
  let adminToken;
  let productId;
  beforeAll(async () => {
    const email = process.env.ADMIN_EMAIL || 'admin@aura.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123admin';
    const hashed = await bcrypt.hash(password, 10);
    await new Promise((res, rej) => {
      db.run('INSERT OR REPLACE INTO users (id, email, password, name, is_admin) VALUES ((SELECT id FROM users WHERE email = ?), ?, ?, ?, 1)', [email, email, hashed, 'Test Admin'], (err) => err ? rej(err) : res());
    });
    const loginRes = await request(app).post('/api/admin/auth/login').send({ email, password });
    adminToken = loginRes.body.token;
  });

  test('create -> update -> delete product', async () => {
    // create
    const nameSuffix = Date.now();
    const createRes = await request(app)
      .post('/api/admin/products')
      .set('Authorization', 'Bearer ' + adminToken)
      .send({ name: `CRUD Product ${nameSuffix}`, description: 'desc', price: 10.5, compare_price: 12, image: '', images: '' });
    expect(createRes.status).toBe(200);
    productId = createRes.body.data.id;

    // update
    const updateRes = await request(app)
      .put(`/api/admin/products/${productId}`)
      .set('Authorization', 'Bearer ' + adminToken)
      .send({ name: `CRUD Product ${nameSuffix} updated`, description: 'desc2', price: 11.5, compare_price: 13, image: '', images: '' });
    expect(updateRes.status).toBe(200);

    // delete
    const delRes = await request(app)
      .delete(`/api/admin/products/${productId}`)
      .set('Authorization', 'Bearer ' + adminToken);
    expect(delRes.status).toBe(200);

    // verify deleted
    const listRes = await request(app)
      .get('/api/admin/products')
      .set('Authorization', 'Bearer ' + adminToken);
    const found = listRes.body.data.products.find(p => p.id === productId);
    expect(found).toBeUndefined();
  });
});
