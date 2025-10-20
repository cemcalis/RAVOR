const jwt = require('jsonwebtoken');
const db = require('../db');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token gerekli'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kullanıcı bilgilerini veritabanından al
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [decoded.userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Geçersiz kullanıcı'
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      address: user.address,
      isAdmin: user.is_admin || false
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Geçersiz token'
    });
  }
};

module.exports = auth;
