const express = require('express');
const router = express.Router();
const db = require('../db');
const adminAuth = require('../middleware/adminAuth');

// Tüm kategorileri getir
router.get('/', (req, res) => {
  db.all('SELECT * FROM categories ORDER BY name ASC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Tüm kategorileri getir (admin)
router.get('/admin', adminAuth, (req, res) => {
  db.all('SELECT * FROM categories ORDER BY name ASC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    res.json({ success: true, data: rows });
  });
});

// Tek kategori detayı
router.get('/:slug', (req, res) => {
  db.get('SELECT * FROM categories WHERE slug = ?', [req.params.slug], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Kategori bulunamadı' });
    }
    res.json(row);
  });
});

// Yeni kategori ekle
router.post('/', (req, res) => {
  const { name, slug, description, image_url } = req.body;

  db.run(
    'INSERT INTO categories (name, slug, description, image_url) VALUES (?, ?, ?, ?)',
    [name, slug, description, image_url],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, message: 'Kategori eklendi' });
    }
  );
});

// Yeni kategori ekle (admin)
router.post('/admin', adminAuth, (req, res) => {
  const { name } = req.body;

  // Slug oluştur
  const slug = name.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/\-+/g, '-');

  db.run(
    'INSERT INTO categories (name, slug) VALUES (?, ?)',
    [name, slug],
    function(err) {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
      res.status(201).json({ success: true, data: { id: this.lastID }, message: 'Kategori oluşturuldu' });
    }
  );
});

// Kategori güncelle (admin)
router.put('/:id', adminAuth, (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  db.run(
    'UPDATE categories SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, id],
    function(err) {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ success: false, message: 'Kategori bulunamadı' });
      }
      res.json({ success: true, message: 'Kategori güncellendi' });
    }
  );
});

// Kategori sil (admin)
router.delete('/:id', adminAuth, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM categories WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'Kategori bulunamadı' });
    }
    res.json({ success: true, message: 'Kategori silindi' });
  });
});

module.exports = router;
