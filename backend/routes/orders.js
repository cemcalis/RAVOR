const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken } = require('./auth');

// Sipariş oluştur (authentication gerekli)
router.post('/', authenticateToken, (req, res) => {
  const { customer_name, customer_email, customer_phone, shipping_address, items, total_amount } = req.body;
  const userId = req.user.userId;

  const orderQuery = `
    INSERT INTO orders (user_id, customer_name, customer_email, customer_phone, shipping_address, total_amount)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(orderQuery, [userId, customer_name, customer_email, customer_phone, shipping_address, total_amount], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const orderId = this.lastID;

    // Sipariş öğelerini ekle
    const itemQuery = 'INSERT INTO order_items (order_id, product_id, variant_id, quantity, price) VALUES (?, ?, ?, ?, ?)';
    
    items.forEach(item => {
      db.run(itemQuery, [orderId, item.product_id, item.variant_id, item.quantity, item.price]);
    });

    res.status(201).json({ 
      order_id: orderId, 
      message: 'Sipariş oluşturuldu',
      customer_email 
    });
  });
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
