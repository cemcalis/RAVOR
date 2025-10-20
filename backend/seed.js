const db = require('./db');

// Seed verilerini ekle
setTimeout(() => {
  console.log('🌱 Seed data ekleniyor...');

  // Kategoriler
  const categories = [
    { name: 'Elbiseler', slug: 'elbiseler', description: 'Şık ve zarif elbise koleksiyonu' },
    { name: 'Üstler', slug: 'ustler', description: 'Bluz, gömlek ve üst giyim' },
    { name: 'Altlar', slug: 'altlar', description: 'Pantolon, etek ve şort' },
    { name: 'Dış Giyim', slug: 'dis-giyim', description: 'Ceket, hırka ve mont' },
    { name: 'Aksesuarlar', slug: 'aksesuarlar', description: 'Çanta, taç ve aksesuarlar' }
  ];

  categories.forEach(cat => {
    db.run(
      'INSERT OR IGNORE INTO categories (name, slug, description) VALUES (?, ?, ?)',
      [cat.name, cat.slug, cat.description],
      (err) => {
        if (err) console.error('Kategori ekleme hatası:', err.message);
      }
    );
  });

  // Örnek ürünler
  const products = [
    {
      name: 'Minimal Siyah Elbise',
      slug: 'minimal-siyah-elbise',
      description: 'Zamansız tasarım, sade ve şık kesim. Her ortamda rahatlıkla giyebileceğiniz minimal elbise.',
      price: 1250.00,
      compare_price: 1650.00,
      category_id: 1,
      image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
        'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800'
      ]),
      stock_status: 'in_stock',
      is_featured: 1,
      is_new: 1
    },
    {
      name: 'Bej Midi Elbise',
      slug: 'bej-midi-elbise',
      description: 'Doğal kumaş, rahat kesim. Günlük şıklığın vazgeçilmezi.',
      price: 1450.00,
      category_id: 1,
      image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800'
      ]),
      stock_status: 'in_stock',
      is_featured: 1,
      is_new: 0
    },
    {
      name: 'Beyaz Keten Gömlek',
      slug: 'beyaz-keten-gomlek',
      description: 'Nefes alan keten kumaş, oversized kesim.',
      price: 850.00,
      category_id: 2,
      image_url: 'https://images.unsplash.com/photo-1624206112918-f140f087f9b5?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1624206112918-f140f087f9b5?w=800'
      ]),
      stock_status: 'in_stock',
      is_featured: 0,
      is_new: 1
    },
    {
      name: 'Gri Triko Kazak',
      slug: 'gri-triko-kazak',
      description: 'Yumuşak triko dokuma, rahat ve sıcak.',
      price: 950.00,
      category_id: 2,
      image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'
      ]),
      stock_status: 'in_stock',
      is_featured: 1,
      is_new: 0
    },
    {
      name: 'Siyah Wide Leg Pantolon',
      slug: 'siyah-wide-leg-pantolon',
      description: 'Yüksek bel, geniş paça. Modern ve rahat.',
      price: 1150.00,
      category_id: 3,
      image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800'
      ]),
      stock_status: 'in_stock',
      is_featured: 0,
      is_new: 1
    },
    {
      name: 'Kahverengi Uzun Hırka',
      slug: 'kahverengi-uzun-hirka',
      description: 'Uzun kesim, cep detaylı hırka.',
      price: 1350.00,
      category_id: 4,
      image_url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800'
      ]),
      stock_status: 'in_stock',
      is_featured: 1,
      is_new: 0
    },
    {
      name: 'Krem Maxi Elbise',
      slug: 'krem-maxi-elbise',
      description: 'Uzun kesim, akışkan kumaş. Özel günler için ideal.',
      price: 1850.00,
      compare_price: 2200.00,
      category_id: 1,
      image_url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800'
      ]),
      stock_status: 'in_stock',
      is_featured: 1,
      is_new: 1
    },
    {
      name: 'Siyah Taç',
      slug: 'siyah-tac',
      description: 'Minimal tasarım taç, saç bandı.',
      price: 250.00,
      category_id: 5,
      image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800'
      ]),
      stock_status: 'in_stock',
      is_featured: 0,
      is_new: 1
    }
  ];

  products.forEach(product => {
    db.run(
      `INSERT OR IGNORE INTO products 
       (name, slug, description, price, compare_price, category_id, image_url, images, stock_status, is_featured, is_new) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.name,
        product.slug,
        product.description,
        product.price,
        product.compare_price || null,
        product.category_id,
        product.image_url,
        product.images,
        product.stock_status,
        product.is_featured,
        product.is_new
      ],
      function(err) {
        if (err) {
          console.error('Ürün ekleme hatası:', err.message);
        } else if (this.changes > 0) {
          console.log(`✅ Eklendi: ${product.name}`);

          // Varyantlar ekle
          const productId = this.lastID;
          const sizes = ['XS', 'S', 'M', 'L', 'XL'];
          sizes.forEach(size => {
            db.run(
              'INSERT INTO variants (product_id, size, stock) VALUES (?, ?, ?)',
              [productId, size, Math.floor(Math.random() * 20) + 5]
            );
          });
        }
      }
    );
  });

  console.log('✅ Seed data tamamlandı!');
}, 1000);

// Ensure admin user exists
setTimeout(() => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@aura.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe!Please-SetEnv';
  const bcrypt = require('bcrypt');
  const SALT_ROUNDS = 10;

  bcrypt.hash(adminPassword, SALT_ROUNDS).then(hashed => {
    db.get('SELECT id FROM users WHERE email = ?', [adminEmail], (err, row) => {
      if (err) return console.error('Admin check error:', err.message);
      if (row) return console.log('Admin user already exists');

      db.run('INSERT INTO users (email, password, name, is_admin) VALUES (?, ?, ?, ?)', [adminEmail, hashed, 'Admin', 1], function(err) {
        if (err) console.error('Admin create error:', err.message);
        else console.log('✅ Admin user created:', adminEmail);
      });
    });
  }).catch(err => console.error('Hash error:', err));
}, 2000);
