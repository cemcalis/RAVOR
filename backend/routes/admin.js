const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const adminAuth = require('../middleware/adminAuth');
const { importFromCSV } = require('../import-csv');

const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(/\s+/g, '-');
    cb(null, Date.now() + '-' + safeName);
  }
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    // Allow svg and common image types
    const allowed = ['image/svg+xml', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images (including SVG) are allowed'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Admin login - DB backed
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email ve şifre gerekli' });
    }

    // Find admin user in DB
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        try {
          if (err) {
            console.error('DB error during admin login lookup:', err);
            return res.status(500).json({ success: false, message: 'Veritabanı hatası' });
          }

          if (!user || !user.is_admin) {
            return res.status(401).json({ success: false, message: 'Geçersiz email veya şifre' });
          }

          // Compare password (stored hashed)
          const match = await bcrypt.compare(password, user.password);
          if (!match) {
            return res.status(401).json({ success: false, message: 'Geçersiz email veya şifre' });
          }

          // Use configured JWT secret or fallback to a development secret to avoid crashing
          const jwtSecret = process.env.JWT_SECRET || 'dev-secret-change-in-production';

          let token;
          try {
            token = jwt.sign({ userId: user.id, email: user.email, isAdmin: true }, jwtSecret, { expiresIn: '24h' });
          } catch (signErr) {
            console.error('JWT sign error:', signErr);
            return res.status(500).json({ success: false, message: 'Giriş sırasında hata oluştu' });
          }

          // Set HttpOnly cookie for admin session (also return token in body for backward compatibility)
          const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
          };

          res.cookie('adminToken', token, cookieOptions);

          res.json({ success: true, token, message: 'Giriş başarılı' });
        } catch (innerErr) {
          // Catch any unexpected error inside the DB callback async flow to avoid crashing the process
          console.error('Unexpected error inside admin login flow:', innerErr && innerErr.stack ? innerErr.stack : innerErr);
          // Provide a minimal error message to the client; full stack is logged
          return res.status(500).json({ success: false, message: 'Sunucu hatası (login)' });
        }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Sunucu hatası' });
  }
});

// Upload product image (admin only)
router.post('/upload', adminAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Dosya gerekli' });
    }

    // If SVG, perform lightweight sanitization: remove <script> blocks and on* attributes
    try {
      const mime = req.file.mimetype || '';
      if (mime === 'image/svg+xml' || path.extname(req.file.originalname).toLowerCase() === '.svg') {
        const filePath = req.file.path;
        let svg = fs.readFileSync(filePath, 'utf8');

        // Remove <script>...</script>
        svg = svg.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');

        // Remove on* attributes like onclick, onload (basic)
        svg = svg.replace(/\son[a-zA-Z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');

        // Remove javascript: in href/xlink:href
        svg = svg.replace(/(href|xlink:href)\s*=\s*("|')?javascript:[^"'>\s]+(\2)?/gi, '$1="#"');

        // Write sanitized content back
        fs.writeFileSync(filePath, svg, 'utf8');
      }
    } catch (sErr) {
      console.error('SVG sanitization error:', sErr);
      // proceed even if sanitization fails
    }

    const fileName = path.basename(req.file.path);
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
    const url = `${baseUrl}/uploads/${fileName}`;

    res.json({ success: true, url, message: 'Dosya yüklendi' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Dosya yüklenemedi' });
  }
});

// Get dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    // Get total products
    const totalProducts = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    // Get total orders
    const totalOrders = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM orders', (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    // Get total users
    const totalUsers = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    // Get total revenue
    const totalRevenue = await new Promise((resolve, reject) => {
      db.get('SELECT SUM(total_amount) as sum FROM orders WHERE status = "completed"', (err, row) => {
        if (err) reject(err);
        else resolve(row.sum || 0);
      });
    });

    // Get recent orders
    const recentOrders = await new Promise((resolve, reject) => {
      db.all(`
        SELECT o.*, u.name as customerName
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
        LIMIT 5
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Error in /api/admin/stats:', error && error.stack ? error.stack : error);
    res.status(500).json({
      success: false,
      message: 'İstatistikler alınamadı'
    });
  }
});

// Get all products
router.get('/products', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    let whereClause = '';
    let params = [];

    if (search) {
      whereClause = 'WHERE name LIKE ? OR description LIKE ?';
      params = [`%${search}%`, `%${search}%`];
    }

    const products = await new Promise((resolve, reject) => {
      db.all(`
        SELECT p.*, c.name as category_name,
               GROUP_CONCAT(DISTINCT v.size) as sizes,
               GROUP_CONCAT(DISTINCT v.color) as colors
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN variants v ON p.id = v.product_id
        ${whereClause}
        GROUP BY p.id
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
      `, [...params, limit, offset], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const total = await new Promise((resolve, reject) => {
      db.get(`
        SELECT COUNT(*) as count FROM products ${whereClause}
      `, params, (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    res.json({
      success: true,
      data: {
        products,
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
      message: 'Ürünler alınamadı'
    });
  }
});

// Create product
router.post('/products', adminAuth, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      compare_price,
      image,
      images,
      category_id,
      stock = 100,
      sizes = [],
      colors = [],
      is_featured = false,
      is_new = false
    } = req.body;

    // Helper to generate slug
    const slugify = (s) => {
      if (!s) return '';
      return s.toString().toLowerCase().trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '')
        .replace(/\-+/g, '-');
    };

    const slug = req.body.slug ? slugify(req.body.slug) : slugify(name);

    // Insert product
    const result = await new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO products (name, slug, description, price, compare_price, image_url, images, category_id, stock, is_featured, is_new)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [name, slug, description, price, compare_price, image, images, category_id, stock, is_featured, is_new], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });

    const productId = result.id;

    // Insert variants (sizes and colors)
    if (sizes.length > 0 || colors.length > 0) {
      for (const size of sizes) {
        for (const color of colors) {
          await new Promise((resolve, reject) => {
            db.run(`
              INSERT INTO variants (product_id, size, color, stock)
              VALUES (?, ?, ?, ?)
            `, [productId, size, color, 0], (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
        }
      }
    }

    res.json({
      success: true,
      data: { id: productId },
      message: 'Ürün oluşturuldu'
    });
  } catch (error) {
    console.error('Product create error:', error && error.stack ? error.stack : error);
    res.status(500).json({
      success: false,
      message: 'Ürün oluşturulamadı'
    });
  }
});

// Update product
router.put('/products/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      compare_price,
      image,
      images,
      category_id,
      stock = 100,
      sizes = [],
      colors = [],
      is_featured = false,
      is_new = false
    } = req.body;

    // Update product
    await new Promise((resolve, reject) => {
      const slug = req.body.slug ? req.body.slug.toString().toLowerCase().trim().replace(/\s+/g,'-').replace(/[^a-z0-9\-]/g,'').replace(/\-+/g,'-') : name.toString().toLowerCase().trim().replace(/\s+/g,'-').replace(/[^a-z0-9\-]/g,'').replace(/\-+/g,'-');
      db.run(`
        UPDATE products
        SET name = ?, slug = ?, description = ?, price = ?, compare_price = ?, image_url = ?, images = ?, category_id = ?, stock = ?, is_featured = ?, is_new = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [name, slug, description, price, compare_price, image, images, category_id, stock, is_featured, is_new, id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Delete existing variants for this product
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM variants WHERE product_id = ?', [id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Insert new variants
    if (sizes.length > 0 || colors.length > 0) {
      for (const size of sizes) {
        for (const color of colors) {
          await new Promise((resolve, reject) => {
            db.run(`
              INSERT INTO variants (product_id, size, color, stock)
              VALUES (?, ?, ?, ?)
            `, [id, size, color, 0], (err) => {
              if (err) reject(err);
              else resolve();
            });
          });
        }
      }
    }

    res.json({
      success: true,
      message: 'Ürün güncellendi'
    });
  } catch (error) {
    console.error('Product update error:', error && error.stack ? error.stack : error);
    res.status(500).json({
      success: false,
      message: 'Ürün güncellenemedi'
    });
  }
});

// Delete product
router.delete('/products/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    await new Promise((resolve, reject) => {
      db.run('DELETE FROM products WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({
      success: true,
      message: 'Ürün silindi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ürün silinemedi'
    });
  }
});

// Get all categories
router.get('/categories', adminAuth, async (req, res) => {
  try {
    const categories = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM categories ORDER BY name', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Kategoriler alınamadı'
    });
  }
});

// Get all orders
router.get('/orders', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const orders = await new Promise((resolve, reject) => {
      db.all(`
        SELECT o.*, u.name as customerName, u.email as customerEmail
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
        LIMIT ? OFFSET ?
      `, [limit, offset], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const total = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM orders', (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    res.json({
      success: true,
      data: {
        orders,
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
      message: 'Siparişler alınamadı'
    });
  }
});

// Update order status
router.put('/orders/:id/status', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await new Promise((resolve, reject) => {
      db.run(`
        UPDATE orders
        SET status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [status, id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({
      success: true,
      message: 'Sipariş durumu güncellendi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Sipariş durumu güncellenemedi'
    });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const users = await new Promise((resolve, reject) => {
      db.all(`
        SELECT id, name, email, created_at
        FROM users
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `, [limit, offset], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const total = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
        if (err) reject(err);
        else resolve(row.count);
      });
    });

    res.json({
      success: true,
      data: {
        users,
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
      message: 'Kullanıcılar alınamadı'
    });
  }
});

// Get user by id
router.get('/users/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      });
    } else {
      res.json({
        success: true,
        data: user
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Kullanıcı alınamadı'
    });
  }
});

// Update user
router.put('/users/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    await new Promise((resolve, reject) => {
      db.run(`
        UPDATE users
        SET name = ?, email = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [name, email, id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({
      success: true,
      message: 'Kullanıcı güncellendi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Kullanıcı güncellenemedi'
    });
  }
});

// Delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    await new Promise((resolve, reject) => {
      db.run('DELETE FROM users WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    res.json({
      success: true,
      message: 'Kullanıcı silindi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Kullanıcı silinemedi'
    });
  }
});

// Get settings
router.get('/settings', adminAuth, async (req, res) => {
  try {
    // For demo purposes, return default settings
    // In production, you should store these in the database
    const settings = {
      siteName: 'AURA E-Commerce',
      siteDescription: 'Modern ve şık alışveriş deneyimi',
      contactEmail: 'info@aura.com',
      phoneNumber: '+90 555 000 0000',
      address: 'İstanbul, Türkiye',
      currency: 'TRY',
      taxRate: '18',
      shippingCost: '25',
      freeShippingThreshold: '500'
    };

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ayarlar alınamadı'
    });
  }
});

// Update settings
router.put('/settings', adminAuth, async (req, res) => {
  try {
    const settings = req.body;

    // In production, you should save these to the database
    // For now, just return success
    console.log('Settings updated:', settings);

    res.json({
      success: true,
      message: 'Ayarlar güncellendi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ayarlar güncellenemedi'
    });
  }
});

// CSV'den ürün import
router.post('/import-csv', adminAuth, async (req, res) => {
  try {
    const { csvData } = req.body;

    if (!csvData) {
      return res.status(400).json({
        success: false,
        message: 'CSV verisi gerekli'
      });
    }

    // Geçici CSV dosyası oluştur
    const fs = require('fs');
    const path = require('path');
    const tempDir = path.join(__dirname, '../temp');

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempFilePath = path.join(tempDir, `import_${Date.now()}.csv`);

    // CSV verisini dosyaya yaz
    const csvContent = csvData.trim();
    fs.writeFileSync(tempFilePath, csvContent);

    // Import işlemini başlat
    importFromCSV(tempFilePath);

    // Geçici dosyayı sil
    setTimeout(() => {
      try {
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }
      } catch (error) {
        console.error('Geçici dosya silinemedi:', error);
      }
    }, 5000);

    res.json({
      success: true,
      message: 'CSV import işlemi başlatıldı. İşlem tamamlandığında sonuçlar konsola yazılacak.'
    });
  } catch (error) {
    console.error('CSV import hatası:', error);
    res.status(500).json({
      success: false,
      message: 'CSV import başarısız'
    });
  }
});

module.exports = router;


