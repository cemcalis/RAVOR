const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// Tüm yorumları getir (ürün ID'sine göre)
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Önce toplam yorum sayısını al
    const total = await new Promise((resolve, reject) => {
      db.get(
        'SELECT COUNT(*) as count FROM reviews WHERE product_id = ? AND is_approved = 1',
        [productId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row.count);
        }
      );
    });

    // Yorumları getir
    const reviews = await new Promise((resolve, reject) => {
      db.all(`
        SELECT r.*, u.name as user_name
        FROM reviews r
        LEFT JOIN users u ON r.user_id = u.id
        WHERE r.product_id = ? AND r.is_approved = 1
        ORDER BY r.created_at DESC
        LIMIT ? OFFSET ?
      `, [productId, limit, offset], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    // Ürün bilgilerini al
    const product = await new Promise((resolve, reject) => {
      db.get('SELECT name, slug FROM products WHERE id = ?', [productId], (err, row) => {
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

    // Ortalama puanı hesapla
    const avgRating = await new Promise((resolve, reject) => {
      db.get(
        'SELECT AVG(rating) as avg FROM reviews WHERE product_id = ? AND is_approved = 1',
        [productId],
        (err, row) => {
          if (err) reject(err);
          else resolve(row.avg || 0);
        }
      );
    });

    res.json({
      success: true,
      data: {
        reviews,
        product,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews: total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Yorumlar alınamadı'
    });
  }
});

// Yeni yorum ekle
router.post('/product/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli puan ve yorum gerekli'
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

    // Kullanıcı zaten yorum yapmış mı kontrol et
    const existingReview = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM reviews WHERE product_id = ? AND user_id = ?', [productId, req.user.id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Bu ürün için zaten yorum yaptınız'
      });
    }

    // Yorum ekle
    await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO reviews (product_id, user_id, customer_name, customer_email, rating, comment)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [productId, req.user.id, req.user.name, req.user.email, rating, comment], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({
      success: true,
      message: 'Yorumunuz eklendi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Yorum eklenemedi'
    });
  }
});

// Yorum güncelle
router.put('/:reviewId', auth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Geçerli puan ve yorum gerekli'
      });
    }

    // Yorumu bul ve kullanıcı kontrolü yap
    const review = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM reviews WHERE id = ?', [reviewId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Yorum bulunamadı'
      });
    }

    // Sadece kendi yorumunu güncelleyebilir veya admin olabilir
    if (review.user_id !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Bu yorumu düzenleme yetkiniz yok'
      });
    }

    // Yorum güncelle
    await new Promise((resolve, reject) => {
      db.run(`
        UPDATE reviews
        SET rating = ?, comment = ?, created_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [rating, comment, reviewId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({
      success: true,
      message: 'Yorum güncellendi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Yorum güncellenemedi'
    });
  }
});

// Yorum sil
router.delete('/:reviewId', auth, async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Yorumu bul ve kullanıcı kontrolü yap
    const review = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM reviews WHERE id = ?', [reviewId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Yorum bulunamadı'
      });
    }

    // Sadece kendi yorumunu silebilir veya admin olabilir
    if (review.user_id !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Bu yorumu silme yetkiniz yok'
      });
    }

    // Yorum sil
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM reviews WHERE id = ?', [reviewId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({
      success: true,
      message: 'Yorum silindi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Yorum silinemedi'
    });
  }
});

// Admin için tüm yorumları getir
router.get('/admin/all', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Admin yetkisi gerekli'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const reviews = await new Promise((resolve, reject) => {
      db.all(`
        SELECT r.*, p.name as product_name, p.slug as product_slug, u.name as user_name
        FROM reviews r
        JOIN products p ON r.product_id = p.id
        LEFT JOIN users u ON r.user_id = u.id
        ORDER BY r.created_at DESC
        LIMIT ? OFFSET ?
      `, [limit, offset], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const total = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM reviews', (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Yorumlar alınamadı'
    });
  }
});

// Admin için yorum onayla/reddet
router.put('/admin/:reviewId/status', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Admin yetkisi gerekli'
      });
    }

    const { reviewId } = req.params;
    const { isApproved } = req.body;

    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE reviews SET is_approved = ? WHERE id = ?',
        [isApproved ? 1 : 0, reviewId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.json({
      success: true,
      message: `Yorum ${isApproved ? 'onaylandı' : 'reddedildi'}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Yorum durumu güncellenemedi'
    });
  }
});

module.exports = router;
