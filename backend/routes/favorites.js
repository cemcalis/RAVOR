const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// Tüm favori ürünleri getir
router.get('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Kullanıcı sadece kendi favorilerini görebilir
    if (req.user.id != userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Yetkisiz erişim'
      });
    }

    const favorites = await new Promise((resolve, reject) => {
      db.all(`
        SELECT f.*, p.name, p.price, p.image_url, p.slug, c.name as category_name
        FROM favorites f
        JOIN products p ON f.product_id = p.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE f.user_id = ?
        ORDER BY f.created_at DESC
      `, [userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json({
      success: true,
      data: favorites
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Favori ürünler alınamadı'
    });
  }
});

// Favoriye ürün ekle
router.post('/:userId/:productId', auth, async (req, res) => {
  try {
    const { userId, productId } = req.params;

    // Kullanıcı sadece kendi favorilerini yönetebilir
    if (req.user.id != userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Yetkisiz erişim'
      });
    }

    // Ürün var mı kontrol et
    const product = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM products WHERE id = ?', [productId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      });
    }

    // Zaten favoride mi kontrol et
    const existing = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM favorites WHERE user_id = ? AND product_id = ?', [userId, productId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Ürün zaten favorilerde'
      });
    }

    // Favoriye ekle
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO favorites (user_id, product_id)
        VALUES (?, ?)
      `, [userId, productId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({
      success: true,
      message: 'Ürün favorilere eklendi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ürün favorilere eklenemedi'
    });
  }
});

// Favoriden ürün çıkar
router.delete('/:userId/:productId', auth, async (req, res) => {
  try {
    const { userId, productId } = req.params;

    // Kullanıcı sadece kendi favorilerini yönetebilir
    if (req.user.id != userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Yetkisiz erişim'
      });
    }

    await new Promise((resolve, reject) => {
      db.run('DELETE FROM favorites WHERE user_id = ? AND product_id = ?', [userId, productId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({
      success: true,
      message: 'Ürün favorilerden çıkarıldı'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ürün favorilerden çıkarılamadı'
    });
  }
});

// Tüm favorileri temizle
router.delete('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;

    // Kullanıcı sadece kendi favorilerini yönetebilir
    if (req.user.id != userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Yetkisiz erişim'
      });
    }

    await new Promise((resolve, reject) => {
      db.run('DELETE FROM favorites WHERE user_id = ?', [userId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({
      success: true,
      message: 'Tüm favoriler temizlendi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Favoriler temizlenemedi'
    });
  }
});

module.exports = router;
