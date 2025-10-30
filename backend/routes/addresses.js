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

// Get all addresses for user
router.get('/', auth, async (req, res) => {
  try {
    const addresses = await allAsync(
      'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC',
      [req.user.id]
    );

    res.json(addresses);
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ error: 'Adresler alınırken hata oluştu' });
  }
});

// Get single address
router.get('/:id', auth, async (req, res) => {
  try {
    const address = await getAsync(
      'SELECT * FROM addresses WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (!address) {
      return res.status(404).json({ error: 'Adres bulunamadı' });
    }

    res.json(address);
  } catch (error) {
    console.error('Get address error:', error);
    res.status(500).json({ error: 'Adres alınırken hata oluştu' });
  }
});

// Create new address
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      full_name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      is_default
    } = req.body;

    if (!full_name || !address_line1 || !city || !postal_code) {
      return res.status(400).json({ error: 'Gerekli alanlar eksik' });
    }

    // If this is set as default, remove default from other addresses
    if (is_default) {
      await runAsync(
        'UPDATE addresses SET is_default = 0 WHERE user_id = ?',
        [req.user.id]
      );
    }

    const result = await runAsync(
      `INSERT INTO addresses 
       (user_id, title, full_name, phone, address_line1, address_line2, city, state, postal_code, country, is_default) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        title || null,
        full_name,
        phone || null,
        address_line1,
        address_line2 || null,
        city,
        state || null,
        postal_code,
        country || 'Türkiye',
        is_default ? 1 : 0
      ]
    );

    const newAddress = await getAsync(
      'SELECT * FROM addresses WHERE id = ?',
      [result.lastID]
    );

    res.status(201).json({ success: true, address: newAddress });
  } catch (error) {
    console.error('Create address error:', error);
    res.status(500).json({ error: 'Adres oluşturulurken hata oluştu' });
  }
});

// Update address
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      full_name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      postal_code,
      country,
      is_default
    } = req.body;

    // Verify ownership
    const existing = await getAsync(
      'SELECT * FROM addresses WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (!existing) {
      return res.status(404).json({ error: 'Adres bulunamadı' });
    }

    // If this is set as default, remove default from other addresses
    if (is_default) {
      await runAsync(
        'UPDATE addresses SET is_default = 0 WHERE user_id = ? AND id != ?',
        [req.user.id, id]
      );
    }

    await runAsync(
      `UPDATE addresses SET 
       title = ?, full_name = ?, phone = ?, address_line1 = ?, address_line2 = ?, 
       city = ?, state = ?, postal_code = ?, country = ?, is_default = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`,
      [
        title || null,
        full_name,
        phone || null,
        address_line1,
        address_line2 || null,
        city,
        state || null,
        postal_code,
        country || 'Türkiye',
        is_default ? 1 : 0,
        id,
        req.user.id
      ]
    );

    const updatedAddress = await getAsync(
      'SELECT * FROM addresses WHERE id = ?',
      [id]
    );

    res.json({ success: true, address: updatedAddress });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ error: 'Adres güncellenirken hata oluştu' });
  }
});

// Delete address
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const existing = await getAsync(
      'SELECT * FROM addresses WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (!existing) {
      return res.status(404).json({ error: 'Adres bulunamadı' });
    }

    await runAsync(
      'DELETE FROM addresses WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    // If deleted address was default, set another as default
    if (existing.is_default) {
      const firstAddress = await getAsync(
        'SELECT id FROM addresses WHERE user_id = ? ORDER BY created_at ASC LIMIT 1',
        [req.user.id]
      );

      if (firstAddress) {
        await runAsync(
          'UPDATE addresses SET is_default = 1 WHERE id = ?',
          [firstAddress.id]
        );
      }
    }

    res.json({ success: true, message: 'Adres silindi' });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ error: 'Adres silinirken hata oluştu' });
  }
});

// Set address as default
router.post('/:id/set-default', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const existing = await getAsync(
      'SELECT * FROM addresses WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (!existing) {
      return res.status(404).json({ error: 'Adres bulunamadı' });
    }

    // Remove default from all addresses
    await runAsync(
      'UPDATE addresses SET is_default = 0 WHERE user_id = ?',
      [req.user.id]
    );

    // Set this as default
    await runAsync(
      'UPDATE addresses SET is_default = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );

    res.json({ success: true, message: 'Varsayılan adres ayarlandı' });
  } catch (error) {
    console.error('Set default address error:', error);
    res.status(500).json({ error: 'Varsayılan adres ayarlanırken hata oluştu' });
  }
});

module.exports = router;
