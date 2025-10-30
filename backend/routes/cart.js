const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../db');

// Basit in-memory cart (gerçek projede session/cookie kullanılır)
let carts = {};

// Sepeti getir
router.get('/:sessionId', (req, res) => {
  const { sessionId } = req.params;

  db.all(
    'SELECT * FROM cart_items WHERE session_id = ? ORDER BY created_at ASC',
    [sessionId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const total = rows.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      res.json({
        items: rows.map(item => ({
          id: item.id,
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          image_url: item.image_url,
          size: item.size,
          color: item.color
        })),
        total
      });
    }
  );
});

// Create a new session id and set cookie (frontend can call this once)
router.post('/session', (req, res) => {
  const sessionId = crypto.randomBytes(12).toString('hex');
  // set cookie so browser sends sessionId automatically; not HttpOnly so frontend can read if needed
  res.cookie('sessionId', sessionId, { maxAge: 30 * 24 * 60 * 60 * 1000, sameSite: 'lax' });
  // initialize empty cart
  carts[sessionId] = { items: [], total: 0 };
  res.json({ success: true, sessionId });
});

// Sepete ürün ekle
router.post('/:sessionId/add', (req, res) => {
  const { sessionId } = req.params;
  const { product_id, variant_id, quantity, price, name, image_url, size, color } = req.body;

  // Önce aynı ürünün sepette olup olmadığını kontrol et
  db.get(
    'SELECT id, quantity FROM cart_items WHERE session_id = ? AND product_id = ? AND variant_id = ?',
    [sessionId, product_id, variant_id],
    (err, existingItem) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (existingItem) {
        // Mevcut ürünü güncelle
        const newQuantity = existingItem.quantity + quantity;
        db.run(
          'UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [newQuantity, existingItem.id],
          function(err) {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            // Güncellenmiş sepeti döndür
            db.all(
              'SELECT * FROM cart_items WHERE session_id = ? ORDER BY created_at ASC',
              [sessionId],
              (err, rows) => {
                if (err) {
                  return res.status(500).json({ error: err.message });
                }

                const total = rows.reduce((sum, item) => sum + (item.price * item.quantity), 0);

                res.json({
                  items: rows.map(item => ({
                    id: item.id,
                    product_id: item.product_id,
                    variant_id: item.variant_id,
                    quantity: item.quantity,
                    price: item.price,
                    name: item.name,
                    image_url: item.image_url,
                    size: item.size,
                    color: item.color
                  })),
                  total
                });
              }
            );
          }
        );
      } else {
        // Yeni ürün ekle
        db.run(
          'INSERT INTO cart_items (session_id, product_id, variant_id, quantity, price, name, image_url, size, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [sessionId, product_id, variant_id || null, quantity, price, name, image_url, size, color],
          function(err) {
            if (err) {
              return res.status(500).json({ error: err.message });
            }

            // Güncellenmiş sepeti döndür
            db.all(
              'SELECT * FROM cart_items WHERE session_id = ? ORDER BY created_at ASC',
              [sessionId],
              (err, rows) => {
                if (err) {
                  return res.status(500).json({ error: err.message });
                }

                const total = rows.reduce((sum, item) => sum + (item.price * item.quantity), 0);

                res.json({
                  items: rows.map(item => ({
                    id: item.id,
                    product_id: item.product_id,
                    variant_id: item.variant_id,
                    quantity: item.quantity,
                    price: item.price,
                    name: item.name,
                    image_url: item.image_url,
                    size: item.size,
                    color: item.color
                  })),
                  total
                });
              }
            );
          }
        );
      }
    }
  );
});

// Sepetten ürün çıkar
router.delete('/:sessionId/remove/:productId', (req, res) => {
  const { sessionId, productId } = req.params;

  db.run(
    'DELETE FROM cart_items WHERE session_id = ? AND product_id = ?',
    [sessionId, parseInt(productId)],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Güncellenmiş sepeti döndür
      db.all(
        'SELECT * FROM cart_items WHERE session_id = ? ORDER BY created_at ASC',
        [sessionId],
        (err, rows) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          const total = rows.reduce((sum, item) => sum + (item.price * item.quantity), 0);

          res.json({
            items: rows.map(item => ({
              id: item.id,
              product_id: item.product_id,
              variant_id: item.variant_id,
              quantity: item.quantity,
              price: item.price,
              name: item.name,
              image_url: item.image_url,
              size: item.size,
              color: item.color
            })),
            total
          });
        }
      );
    }
  );
});

// Sepeti temizle
router.delete('/:sessionId', (req, res) => {
  const { sessionId } = req.params;

  db.run(
    'DELETE FROM cart_items WHERE session_id = ?',
    [sessionId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({ items: [], total: 0 });
    }
  );
});

module.exports = router;
