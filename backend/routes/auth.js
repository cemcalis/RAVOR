const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 10;

// Kayıt ol
router.post('/register', async (req, res) => {
  const { email, password, name, phone, address } = req.body;

  // Validasyon
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, şifre ve isim gereklidir' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Şifre en az 6 karakter olmalıdır' });
  }

  try {
    // Email kontrolü
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Veritabanı hatası' });
      }

      if (user) {
        return res.status(400).json({ error: 'Bu email zaten kayıtlı' });
      }

      // Şifreyi hashle
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      // Kullanıcıyı kaydet
      const query = 'INSERT INTO users (email, password, name, phone, address) VALUES (?, ?, ?, ?, ?)';
      db.run(query, [email, hashedPassword, name, phone || null, address || null], function(err) {
        if (err) {
          return res.status(500).json({ error: 'Kayıt başarısız' });
        }

        // JWT token oluştur
        const token = jwt.sign({ userId: this.lastID, email }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
          message: 'Kayıt başarılı',
          token,
          user: {
            id: this.lastID,
            email,
            name,
            phone,
            address
          }
        });
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// Giriş yap
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email ve şifre gereklidir' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Veritabanı hatası' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Email veya şifre hatalı' });
    }

    try {
      // Şifre kontrolü
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ error: 'Email veya şifre hatalı' });
      }

      // JWT token oluştur
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

      res.json({
        message: 'Giriş başarılı',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          address: user.address
        }
      });
    } catch (error) {
      res.status(500).json({ error: 'Sunucu hatası' });
    }
  });
});

// Token'ı doğrula
router.post('/verify', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ error: 'Token bulunamadı' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Geçersiz token' });
    }

    // Kullanıcı bilgilerini getir
    db.get('SELECT id, email, name, phone, address FROM users WHERE id = ?', [decoded.userId], (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Veritabanı hatası' });
      }

      if (!user) {
        return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
      }

      res.json({
        message: 'Token geçerli',
        user
      });
    });
  });
});

// Kullanıcı bilgilerini güncelle
router.put('/me', authenticateToken, (req, res) => {
  const { name, phone, address } = req.body;

  const query = 'UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?';
  db.run(query, [name, phone, address, req.user.userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Güncelleme başarısız' });
    }

    res.json({ message: 'Bilgiler güncellendi' });
  });
});

// Middleware: Token doğrulama
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token bulunamadı' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Geçersiz token' });
    }

    req.user = user;
    next();
  });
}

module.exports = router;
module.exports.authenticateToken = authenticateToken;
