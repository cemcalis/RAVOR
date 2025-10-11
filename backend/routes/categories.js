const express = require('express');
const router = express.Router();
const db = require('../db');

// Tüm kategorileri getir
router.get('/', (req, res) => {
  db.all('SELECT * FROM categories ORDER BY name ASC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
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

module.exports = router;
