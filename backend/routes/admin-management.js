const express = require('express');
const db = require('../db');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// List users (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    db.all('SELECT id, name, email, is_admin, created_at FROM users ORDER BY created_at DESC', (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: 'Kullanıcılar alınamadı' });
      res.json({ success: true, data: rows });
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
});

// Promote user to admin
router.post('/promote', adminAuth, async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: 'userId gerekli' });

    db.run('UPDATE users SET is_admin = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [userId], function(err) {
      if (err) return res.status(500).json({ success: false, message: 'Güncelleme hatası' });
      if (this.changes === 0) return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı' });
      res.json({ success: true, message: 'Kullanıcı admin yapıldı' });
    });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
});

module.exports = router;
