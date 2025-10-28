const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Basit in-memory cart (gerçek projede session/cookie kullanılır)
let carts = {};

// Sepeti getir
router.get('/:sessionId', (req, res) => {
  const cart = carts[req.params.sessionId] || { items: [], total: 0 };
  res.json(cart);
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
  const { product_id, variant_id, quantity, price, name, image_url } = req.body;

  if (!carts[sessionId]) {
    carts[sessionId] = { items: [], total: 0 };
  }

  const existingItem = carts[sessionId].items.find(
    item => item.product_id === product_id && item.variant_id === variant_id
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    carts[sessionId].items.push({
      product_id,
      variant_id,
      quantity,
      price,
      name,
      image_url
    });
  }

  // Toplam hesapla
  carts[sessionId].total = carts[sessionId].items.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  res.json(carts[sessionId]);
});

// Sepetten ürün çıkar
router.delete('/:sessionId/remove/:productId', (req, res) => {
  const { sessionId, productId } = req.params;

  if (carts[sessionId]) {
    carts[sessionId].items = carts[sessionId].items.filter(
      item => item.product_id !== parseInt(productId)
    );

    carts[sessionId].total = carts[sessionId].items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );
  }

  res.json(carts[sessionId] || { items: [], total: 0 });
});

// Sepeti temizle
router.delete('/:sessionId', (req, res) => {
  delete carts[req.params.sessionId];
  res.json({ items: [], total: 0 });
});

module.exports = router;
