const express = require('express');
const router = express.Router();
const db = require('../db');
const adminAuth = require('../middleware/adminAuth');

// Tüm ürünleri getir (filtreleme + sıralama)
router.get('/', (req, res) => {
  const { category, sort, featured, new_arrivals, search } = req.query;
  
  let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.is_active = 1';
  const params = [];

  if (category) {
    query += ' AND c.slug = ?';
    params.push(category);
  }

  if (featured === 'true') {
    query += ' AND p.is_featured = 1';
  }

  if (new_arrivals === 'true') {
    query += ' AND p.is_new = 1';
  }

  if (search) {
    query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  // Sıralama
  switch (sort) {
    case 'price_asc':
      query += ' ORDER BY p.price ASC';
      break;
    case 'price_desc':
      query += ' ORDER BY p.price DESC';
      break;
    case 'name_asc':
      query += ' ORDER BY p.name ASC';
      break;
    case 'name_desc':
      query += ' ORDER BY p.name DESC';
      break;
    case 'newest':
      query += ' ORDER BY p.created_at DESC';
      break;
    default:
      query += ' ORDER BY p.is_featured DESC, p.created_at DESC';
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    // Images JSON parse
    const products = rows.map(p => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : []
    }));
    
    res.json(products);
  });
});

// Tek ürün detayı
router.get('/:slug', (req, res) => {
  const query = `
    SELECT p.*, c.name as category_name, c.slug as category_slug 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id 
    WHERE p.slug = ?
  `;

  db.get(query, [req.params.slug], (err, product) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!product) {
      return res.status(404).json({ error: 'Ürün bulunamadı' });
    }

    // Varyantları getir
    db.all('SELECT * FROM variants WHERE product_id = ?', [product.id], (err, variants) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      product.images = product.images ? JSON.parse(product.images) : [];
      product.variants = variants;

      res.json(product);
    });
  });
});

// Yeni ürün ekle
router.post('/', adminAuth, (req, res) => {
  const { name, slug, description, price, compare_price, category_id, image_url, images, stock_status, is_featured, is_new } = req.body;

  const query = `
    INSERT INTO products (name, slug, description, price, compare_price, category_id, image_url, images, stock_status, is_featured, is_new)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const imagesJson = images ? JSON.stringify(images) : null;

  db.run(query, [name, slug, description, price, compare_price, category_id, image_url, imagesJson, stock_status, is_featured, is_new], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, message: 'Ürün eklendi' });
  });
});

module.exports = router;
