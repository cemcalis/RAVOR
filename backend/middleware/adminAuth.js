const jwt = require('jsonwebtoken');
const db = require('../db');

// Only accept Authorization: Bearer <token>
const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const token = authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Admin token gerekli' });
    }

    const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (e) {
      return res.status(401).json({ success: false, message: 'Geçersiz token' });
    }

    if (!decoded || !decoded.userId) {
      return res.status(403).json({ success: false, message: 'Geçersiz token' });
    }

    // Ensure user exists and is admin in DB
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT id, email, is_admin FROM users WHERE id = ?', [decoded.userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Kullanıcı bulunamadı' });
    }

    // Normalize is_admin truthiness (sqlite stores 0/1 or NULL)
    const isAdmin = Boolean(user.is_admin && Number(user.is_admin) === 1 || user.is_admin === 1 || user.is_admin === true);
    if (!isAdmin) {
      return res.status(403).json({ success: false, message: 'Admin yetkisi gerekli' });
    }

    req.admin = { id: user.id, email: user.email };
    next();
  } catch (error) {
    console.error('adminAuth error:', error && error.stack ? error.stack : error);
    return res.status(401).json({ success: false, message: 'Geçersiz token' });
  }
};

module.exports = adminAuth;
