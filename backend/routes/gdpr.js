const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Helper functions
function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });
}

// Update GDPR consent
router.post('/consent', auth, async (req, res) => {
  try {
    const { gdpr_consent, marketing_consent } = req.body;

    await runAsync(
      `UPDATE users SET 
       gdpr_consent = ?, 
       gdpr_consent_date = CURRENT_TIMESTAMP,
       marketing_consent = ?,
       updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [gdpr_consent ? 1 : 0, marketing_consent ? 1 : 0, req.user.id]
    );

    res.json({ success: true, message: 'Tercihleriniz kaydedildi' });
  } catch (error) {
    console.error('Update consent error:', error);
    res.status(500).json({ error: 'Tercihler kaydedilemedi' });
  }
});

// Request data export
router.post('/export-data', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Check for pending requests
    const pending = await getAsync(
      'SELECT id FROM data_export_requests WHERE user_id = ? AND status = "pending"',
      [userId]
    );

    if (pending) {
      return res.status(400).json({ error: 'Bekleyen bir veri dışa aktarma talebiniz var' });
    }

    // Create export request
    const result = await runAsync(
      'INSERT INTO data_export_requests (user_id) VALUES (?)',
      [userId]
    );

    // In production, this would trigger a background job to collect and package user data
    // For now, we'll collect basic data immediately
    const userData = await collectUserData(userId);

    await runAsync(
      'UPDATE data_export_requests SET status = ?, export_data = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['completed', JSON.stringify(userData), result.lastID]
    );

    res.json({ 
      success: true, 
      message: 'Verileriniz hazırlanıyor. Email adresinize gönderilecek.',
      request_id: result.lastID,
      data: userData
    });
  } catch (error) {
    console.error('Export data error:', error);
    res.status(500).json({ error: 'Veri dışa aktarma talebi oluşturulamadı' });
  }
});

// Helper function to collect all user data
async function collectUserData(userId) {
  const user = await getAsync(
    'SELECT id, email, name, phone, address, created_at FROM users WHERE id = ?',
    [userId]
  );

  const orders = await allAsync(
    'SELECT * FROM orders WHERE user_id = ?',
    [userId]
  );

  const addresses = await allAsync(
    'SELECT * FROM addresses WHERE user_id = ?',
    [userId]
  );

  const favorites = await allAsync(
    `SELECT f.*, p.name as product_name 
     FROM favorites f 
     LEFT JOIN products p ON f.product_id = p.id 
     WHERE f.user_id = ?`,
    [userId]
  );

  const reviews = await allAsync(
    'SELECT * FROM reviews WHERE user_id = ?',
    [userId]
  );

  const recentlyViewed = await allAsync(
    `SELECT rv.*, p.name as product_name 
     FROM recently_viewed rv 
     LEFT JOIN products p ON rv.product_id = p.id 
     WHERE rv.user_id = ?`,
    [userId]
  );

  return {
    user,
    orders,
    addresses,
    favorites,
    reviews,
    recently_viewed: recentlyViewed,
    export_date: new Date().toISOString()
  };
}

// Request account deletion
router.post('/delete-account', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    const userId = req.user.id;

    // Check for pending requests
    const pending = await getAsync(
      'SELECT id FROM account_deletion_requests WHERE user_id = ? AND status = "pending"',
      [userId]
    );

    if (pending) {
      return res.status(400).json({ error: 'Bekleyen bir hesap silme talebiniz var' });
    }

    // Schedule deletion for 30 days from now (GDPR requirement)
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + 30);

    await runAsync(
      'INSERT INTO account_deletion_requests (user_id, reason, scheduled_deletion_at) VALUES (?, ?, ?)',
      [userId, reason || null, scheduledDate.toISOString()]
    );

    res.json({ 
      success: true, 
      message: 'Hesap silme talebiniz alındı. 30 gün içinde iptal edebilirsiniz.',
      scheduled_deletion: scheduledDate.toISOString()
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Hesap silme talebi oluşturulamadı' });
  }
});

// Cancel account deletion
router.post('/cancel-deletion', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await runAsync(
      'UPDATE account_deletion_requests SET status = "cancelled", completed_at = CURRENT_TIMESTAMP WHERE user_id = ? AND status = "pending"',
      [userId]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Bekleyen silme talebi bulunamadı' });
    }

    res.json({ success: true, message: 'Hesap silme talebiniz iptal edildi' });
  } catch (error) {
    console.error('Cancel deletion error:', error);
    res.status(500).json({ error: 'İptal işlemi başarısız' });
  }
});

// Cookie consent
router.post('/cookie-consent', async (req, res) => {
  try {
    const { essential, analytics, marketing, preferences } = req.body;
    const userId = req.user?.id || null;
    const sessionId = req.sessionID || req.body.session_id;
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];

    await runAsync(
      'INSERT INTO cookie_consents (session_id, user_id, essential, analytics, marketing, preferences, ip_address, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [sessionId, userId, essential ? 1 : 0, analytics ? 1 : 0, marketing ? 1 : 0, preferences ? 1 : 0, ipAddress, userAgent]
    );

    res.json({ success: true, message: 'Çerez tercihleri kaydedildi' });
  } catch (error) {
    console.error('Cookie consent error:', error);
    res.status(500).json({ error: 'Tercihler kaydedilemedi' });
  }
});

// Get cookie consent status
router.get('/cookie-consent', async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const sessionId = req.query.session_id;

    let consent;
    if (userId) {
      consent = await getAsync(
        'SELECT * FROM cookie_consents WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
        [userId]
      );
    } else if (sessionId) {
      consent = await getAsync(
        'SELECT * FROM cookie_consents WHERE session_id = ? ORDER BY created_at DESC LIMIT 1',
        [sessionId]
      );
    }

    if (!consent) {
      return res.json({ has_consent: false });
    }

    res.json({
      has_consent: true,
      essential: consent.essential === 1,
      analytics: consent.analytics === 1,
      marketing: consent.marketing === 1,
      preferences: consent.preferences === 1,
      updated_at: consent.updated_at
    });
  } catch (error) {
    console.error('Get cookie consent error:', error);
    res.status(500).json({ error: 'Tercihler alınamadı' });
  }
});

// Admin: Get all data export requests
router.get('/admin/export-requests', auth, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Yetkisiz erişim' });
  }

  try {
    const requests = await allAsync(
      `SELECT der.*, u.email, u.name 
       FROM data_export_requests der
       LEFT JOIN users u ON der.user_id = u.id
       ORDER BY der.requested_at DESC`
    );

    res.json(requests);
  } catch (error) {
    console.error('Get export requests error:', error);
    res.status(500).json({ error: 'Talepler alınamadı' });
  }
});

// Admin: Get all deletion requests
router.get('/admin/deletion-requests', auth, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: 'Yetkisiz erişim' });
  }

  try {
    const requests = await allAsync(
      `SELECT adr.*, u.email, u.name 
       FROM account_deletion_requests adr
       LEFT JOIN users u ON adr.user_id = u.id
       ORDER BY adr.requested_at DESC`
    );

    res.json(requests);
  } catch (error) {
    console.error('Get deletion requests error:', error);
    res.status(500).json({ error: 'Talepler alınamadı' });
  }
});

module.exports = router;
