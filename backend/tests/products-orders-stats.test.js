const request = require('supertest');
const app = require('../server');
const db = require('../db');
const bcrypt = require('bcrypt');

describe('Products, Orders and Stats', () => {
  let adminToken;
  beforeAll(async () => {
    const email = process.env.ADMIN_EMAIL || 'admin@aura.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123admin';
    const hashed = await bcrypt.hash(password, 10);
    await new Promise((res, rej) => {
      db.run('INSERT OR REPLACE INTO users (id, email, password, name, is_admin) VALUES ((SELECT id FROM users WHERE email = ?), ?, ?, ?, 1)', [email, email, hashed, 'Test Admin'], (err) => err ? rej(err) : res());
    });

    const loginRes = await request(app).post('/api/admin/auth/login').send({ email, password });
    expect(loginRes.status).toBe(200);
    adminToken = loginRes.body.token;
  });

  test('create product, create order and verify stats', async () => {
    // Create product (use unique name to avoid slug collisions)
    const uniqueSuffix = Date.now();
    const productRes = await request(app)
      .post('/api/admin/products')
      .set('Authorization', 'Bearer ' + adminToken)
      .send({
        name: `Test Product ${uniqueSuffix}`,
        description: 'A product for tests',
        price: 99.99,
        compare_price: 129.99,
        image: '',
        images: '',
        category_id: null
      });

    expect(productRes.status).toBe(200);
    const productId = productRes.body.data.id;

    // Register a customer and get token (orders API requires authentication)
    const custEmail = `custx+${Date.now()}@example.com`;
    const customerRes = await request(app)
      .post('/api/auth/register')
      .send({ email: custEmail, password: 'custpass', name: 'Customer X' });

    expect([200,201]).toContain(customerRes.status);
    const customerToken = customerRes.body.token;

    // Create order (authenticated)
    const orderPayload = {
  customer_name: 'Customer X',
  customer_email: custEmail,
      customer_phone: '555',
      shipping_address: 'Somewhere',
      total_amount: 99.99,
      status: 'completed',
      items: [ { product_id: productId, quantity: 1, price: 99.99 } ]
    };

    const orderRes = await request(app)
      .post('/api/orders')
      .set('Authorization', 'Bearer ' + customerToken)
      .send(orderPayload);

    expect([200,201]).toContain(orderRes.status);

    // Check stats
    const statsRes = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', 'Bearer ' + adminToken);

    expect(statsRes.status).toBe(200);
    const data = statsRes.body.data;
    expect(data.totalProducts).toBeGreaterThanOrEqual(1);
    expect(data.totalOrders).toBeGreaterThanOrEqual(1);
    expect(data.totalRevenue).toBeGreaterThanOrEqual(0);
  });
});
