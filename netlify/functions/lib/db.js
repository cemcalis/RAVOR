const { getStore } = require('@netlify/blobs');

// Netlify Blobs store
let store;

const getDbStore = () => {
  if (!store) {
    store = getStore('database');
  }
  return store;
};

// Helper functions
const getAllData = async (key) => {
  try {
    const store = getDbStore();
    const data = await store.get(key, { type: 'json' });
    return data || [];
  } catch (error) {
    console.error(`Error getting ${key}:`, error);
    return [];
  }
};

const setAllData = async (key, data) => {
  try {
    const store = getDbStore();
    await store.set(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error setting ${key}:`, error);
    return false;
  }
};

// Products
const getProducts = async (filters = {}) => {
  const products = await getAllData('products');
  let filtered = products;

  if (filters.category) {
    filtered = filtered.filter(p => p.category_slug === filters.category);
  }
  if (filters.featured) {
    filtered = filtered.filter(p => p.is_featured);
  }
  if (filters.new_arrivals) {
    filtered = filtered.filter(p => p.is_new_arrival);
  }
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(search) || 
      p.description.toLowerCase().includes(search)
    );
  }

  if (filters.sort === 'price_asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (filters.sort === 'price_desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (filters.sort === 'newest') {
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  return filtered;
};

const getProductBySlug = async (slug) => {
  const products = await getAllData('products');
  return products.find(p => p.slug === slug);
};

const createProduct = async (product) => {
  const products = await getAllData('products');
  const newProduct = {
    id: Date.now(),
    ...product,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  products.push(newProduct);
  await setAllData('products', products);
  return newProduct;
};

// Categories
const getCategories = async () => {
  return await getAllData('categories');
};

const getCategoryBySlug = async (slug) => {
  const categories = await getAllData('categories');
  return categories.find(c => c.slug === slug);
};

// Cart
const getCart = async (sessionId) => {
  const carts = await getAllData('carts');
  return carts[sessionId] || { items: [], total: 0 };
};

const updateCart = async (sessionId, cart) => {
  const carts = await getAllData('carts');
  carts[sessionId] = cart;
  await setAllData('carts', carts);
  return cart;
};

const clearCart = async (sessionId) => {
  const carts = await getAllData('carts');
  delete carts[sessionId];
  await setAllData('carts', carts);
  return true;
};

// Orders
const createOrder = async (order) => {
  const orders = await getAllData('orders');
  const newOrder = {
    id: Date.now(),
    ...order,
    created_at: new Date().toISOString()
  };
  orders.push(newOrder);
  await setAllData('orders', orders);
  return newOrder;
};

const getOrderById = async (id) => {
  const orders = await getAllData('orders');
  return orders.find(o => o.id === parseInt(id));
};

const getOrdersByEmail = async (email) => {
  const orders = await getAllData('orders');
  return orders.filter(o => o.customer_email === email);
};

// Users (for authentication)
const getUserByEmail = async (email) => {
  const users = await getAllData('users');
  return users.find(u => u.email === email);
};

const createUser = async (user) => {
  const users = await getAllData('users');
  const newUser = {
    id: Date.now(),
    ...user,
    created_at: new Date().toISOString()
  };
  users.push(newUser);
  await setAllData('users', users);
  return newUser;
};

// Initialize database with seed data
const initializeDatabase = async () => {
  const products = await getAllData('products');
  if (products.length === 0) {
    // Seed categories
    const categories = [
      { id: 1, name: 'Elbiseler', slug: 'elbiseler', description: 'Şık ve zarif elbise modelleri' },
      { id: 2, name: 'Üstler', slug: 'ustler', description: 'Bluz, gömlek ve tişört modelleri' },
      { id: 3, name: 'Altlar', slug: 'altlar', description: 'Pantolon, etek ve şort modelleri' },
      { id: 4, name: 'Dış Giyim', slug: 'dis-giyim', description: 'Mont, ceket ve hırka modelleri' },
      { id: 5, name: 'Aksesuarlar', slug: 'aksesuarlar', description: 'Çanta, şapka ve takı modelleri' }
    ];
    await setAllData('categories', categories);

    // Seed products
    const seedProducts = [
      {
        id: 1,
        name: 'Minimal Siyah Elbise',
        slug: 'minimal-siyah-elbise',
        description: 'Zarif ve şık siyah elbise. Her ortamda rahatlıkla giyebileceğiniz minimal tasarım.',
        price: 899.99,
        category_id: 1,
        category_slug: 'elbiseler',
        image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
          'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800'
        ]),
        sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
        colors: JSON.stringify(['Siyah']),
        is_featured: 1,
        is_new_arrival: 1,
        stock: 50,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Beyaz Pamuklu Gömlek',
        slug: 'beyaz-pamuklu-gomlek',
        description: 'Klasik beyaz gömlek. %100 pamuklu kumaş ile tüm gün konfor.',
        price: 449.99,
        category_id: 2,
        category_slug: 'ustler',
        image_url: 'https://images.unsplash.com/photo-1624206112918-f140f087f9b5?w=800',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1624206112918-f140f087f9b5?w=800'
        ]),
        sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
        colors: JSON.stringify(['Beyaz']),
        is_featured: 1,
        is_new_arrival: 0,
        stock: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Yüksek Bel Jean Pantolon',
        slug: 'yuksek-bel-jean-pantolon',
        description: 'Rahat kesim yüksek bel jean pantolon. Günlük kullanım için ideal.',
        price: 599.99,
        category_id: 3,
        category_slug: 'altlar',
        image_url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800'
        ]),
        sizes: JSON.stringify(['XS', 'S', 'M', 'L', 'XL']),
        colors: JSON.stringify(['Mavi', 'Siyah']),
        is_featured: 0,
        is_new_arrival: 1,
        stock: 75,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 4,
        name: 'Oversize Trençkot',
        slug: 'oversize-trenckot',
        description: 'Modern oversize kesim trençkot. Su geçirmez kumaş.',
        price: 1299.99,
        category_id: 4,
        category_slug: 'dis-giyim',
        image_url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800'
        ]),
        sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
        colors: JSON.stringify(['Bej', 'Siyah']),
        is_featured: 1,
        is_new_arrival: 1,
        stock: 30,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
    await setAllData('products', seedProducts);
    await setAllData('carts', {});
    await setAllData('orders', []);
    await setAllData('users', []);
    
    console.log('✅ Database initialized with seed data');
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  getCategories,
  getCategoryBySlug,
  getCart,
  updateCart,
  clearCart,
  createOrder,
  getOrderById,
  getOrdersByEmail,
  getUserByEmail,
  createUser,
  initializeDatabase
};
