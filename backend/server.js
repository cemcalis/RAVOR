require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const db = require('./db');
const logger = require('./lib/logger');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// parse cookies
app.use(cookieParser());

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const adminMgmtRoutes = require('./routes/admin-management');
const favoritesRoutes = require('./routes/favorites');
const reviewRoutes = require('./routes/reviews');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin-management', adminMgmtRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve uploaded files (make sure uploads are saved to backend/public/uploads)
const path = require('path');
const uploadsPath = path.join(__dirname, 'public', 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Error handling
app.use((err, req, res, next) => {
  logger.error(err && err.stack ? err.stack : String(err));
  res.status(500).json({ error: 'Bir hata oluştu!' });
});

// Start server only when run directly
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`🚀 Server çalışıyor: http://localhost:${PORT}`);
    logger.info(`📊 API endpoint: http://localhost:${PORT}/api`);
  });
}

module.exports = app;