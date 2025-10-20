const express = require('express');
const router = express.Router();
const db = require('../db');
const logger = require('../lib/logger');
const { authenticateToken } = require('./auth');

// Helper promisified DB functions
function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

// Sipariş oluştur (authentication gerekli)
router.post('/', authenticateToken, async (req, res) => {
  const {
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    items = [],
    total_amount,
    payment_method
  } = req.body;

  const userId = req.user?.userId || req.user?.id;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Sipariş için en az bir ürün gerekli' });
  }

  try {
    // Aggregate quantities per variant to avoid double-check races in same order
    const qtyByVariant = {};
    for (const it of items) {
      const vid = it.variant_id || 0; // 0 means no variant
      qtyByVariant[vid] = (qtyByVariant[vid] || 0) + (Number(it.quantity) || 0);
    }

    // Begin transaction
    await runAsync('BEGIN TRANSACTION');

    // Check stock for variants referenced in order
    for (const [vidStr, requiredQty] of Object.entries(qtyByVariant)) {
      const vid = Number(vidStr);
      if (vid > 0) {
        const variant = await getAsync('SELECT id, product_id, stock FROM variants WHERE id = ?', [vid]);
        if (!variant) {
          await runAsync('ROLLBACK');
          return res.status(400).json({ error: `Varyant bulunamadı (variant_id=${vid})` });
        }
        if (variant.stock == null) variant.stock = 0;
        if (variant.stock < requiredQty) {
          await runAsync('ROLLBACK');
          return res.status(400).json({ error: `Yetersiz stok: variant_id=${vid}` });
        }
      }
    }

    // Insert order
    const insertOrder = `
      INSERT INTO orders (user_id, customer_name, customer_email, customer_phone, shipping_address, total_amount, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, 'pending', CURRENT_TIMESTAMP)
    `;

    const orderResult = await runAsync(insertOrder, [userId, customer_name, customer_email, customer_phone, shipping_address, total_amount]);
    const orderId = orderResult.lastID;

  // Insert order items and decrement variant stocks or product stock
  const itemQuery = 'INSERT INTO order_items (order_id, product_id, variant_id, quantity, price) VALUES (?, ?, ?, ?, ?)';

    for (const item of items) {
      const productId = item.product_id || null;
      const variantId = item.variant_id || null;
      const quantity = Number(item.quantity) || 1;
      const price = Number(item.price) || 0;

      await runAsync(itemQuery, [orderId, productId, variantId, quantity, price]);

      if (variantId) {
        // Decrement stock for the variant
        await runAsync('UPDATE variants SET stock = stock - ? WHERE id = ?', [quantity, variantId]);
        logger.info(`Order ${orderId}: decremented variant ${variantId} by ${quantity}`);
      } else if (productId) {
        // Decrement product-level stock if exists
        const prod = await getAsync('SELECT id, stock FROM products WHERE id = ?', [productId]);
        if (!prod) {
          await runAsync('ROLLBACK');
          return res.status(400).json({ error: `Ürün bulunamadı (product_id=${productId})` });
        }
        if (prod.stock == null) prod.stock = 0;
        if (prod.stock < quantity) {
          await runAsync('ROLLBACK');
          return res.status(400).json({ error: `Yetersiz stok: product_id=${productId}` });
        }
        await runAsync('UPDATE products SET stock = stock - ? WHERE id = ?', [quantity, productId]);
        logger.info(`Order ${orderId}: decremented product ${productId} by ${quantity}`);
      }
    }

    // Commit transaction
    await runAsync('COMMIT');

    res.status(201).json({ order_id: orderId, message: 'Sipariş oluşturuldu', customer_email });
  } catch (err) {
    // Try rollback if possible
    try {
      await runAsync('ROLLBACK');
    } catch (e) {
      // ignore
    }
    console.error('Order creation error:', err && err.stack ? err.stack : err);
    res.status(500).json({ error: 'Sipariş oluşturulurken hata oluştu' });
  }
});

// Kullanıcının tüm siparişlerini getir
router.get('/', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const query = 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC';
  
  db.all(query, [userId], (err, orders) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(orders);
  });
});

// Sipariş detayı
router.get('/:id', authenticateToken, (req, res) => {
  const orderQuery = 'SELECT * FROM orders WHERE id = ?';
  
  db.get(orderQuery, [req.params.id], (err, order) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!order) {
      return res.status(404).json({ error: 'Sipariş bulunamadı' });
    }

    // Sipariş öğelerini getir
    const itemsQuery = `
      SELECT oi.*, p.name, p.image_url 
      FROM order_items oi 
      LEFT JOIN products p ON oi.product_id = p.id 
      WHERE oi.order_id = ?
    `;

    db.all(itemsQuery, [order.id], (err, items) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      order.items = items;
      res.json(order);
    });
  });
});

module.exports = router;
