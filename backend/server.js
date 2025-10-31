require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const db = require('./db');
const logger = require('./lib/logger');
const cookieParser = require('cookie-parser');
const { helmetConfig, sanitizeInput, apiLimiter, generateCsrfToken } = require('./middleware/security');
const { apiVersioning, getVersionInfo } = require('./middleware/apiVersion');
const { PerformanceMonitor, HealthCheck, checkDatabase, checkMemory, checkUptime } = require('./lib/monitoring');

const app = express();
const PORT = process.env.PORT || 5001;

// Initialize monitoring
const performanceMonitor = new PerformanceMonitor();
const healthCheck = new HealthCheck();

// Add health checks
healthCheck.addCheck('database', () => checkDatabase(db));
healthCheck.addCheck('memory', checkMemory);
healthCheck.addCheck('uptime', checkUptime);

// Performance monitoring middleware (before other middleware)
app.use(performanceMonitor.requestMonitor());

// Security middleware
app.use(helmetConfig);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Input sanitization
app.use(sanitizeInput);

// CSRF token generation
app.use(generateCsrfToken);

// Rate limiting for all API routes
app.use('/api', apiLimiter);

// API versioning
app.use('/api', apiVersioning);

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
const stockAlertsRoutes = require('./routes/stock-alerts');
const analyticsRoutes = require('./routes/analytics');
const profileRoutes = require('./routes/profile');
const addressesRoutes = require('./routes/addresses');
const productFeaturesRoutes = require('./routes/product-features');
const searchRoutes = require('./routes/search');
const couponsRoutes = require('./routes/coupons');
const cmsRoutes = require('./routes/cms');
const gdprRoutes = require('./routes/gdpr');
const twoFactorRoutes = require('./routes/two-factor');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin-management', adminMgmtRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/stock-alerts', stockAlertsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/addresses', addressesRoutes);
app.use('/api/product-features', productFeaturesRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/coupons', couponsRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/gdpr', gdprRoutes);
app.use('/api/2fa', twoFactorRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  const health = await healthCheck.runChecks();
  const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 207 : 503;
  res.status(statusCode).json(health);
});

// API version info
app.get('/api/version', getVersionInfo);

// Performance metrics (admin only)
app.get('/api/metrics', (req, res) => {
  // Simple auth check - in production use proper auth middleware
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const metrics = performanceMonitor.getMetrics();
  res.json(metrics);
});

// Reset metrics (admin only)
app.post('/api/metrics/reset', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  performanceMonitor.reset();
  res.json({ success: true, message: 'Metrics reset' });
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