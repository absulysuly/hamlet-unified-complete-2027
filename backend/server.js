const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import compiled routes from dist
const { socialRouter } = require('./dist/routes/social');
const { civicRouter } = require('./dist/routes/civic');
const { authRouter } = require('./dist/routes/auth');
const candidatePortalRouter = require('./dist/routes/candidatePortal').default;

// Mount routes under /api prefix for compatibility
app.use('/api/auth', authRouter);
app.use('/api/social', socialRouter);
app.use('/api/civic', civicRouter);
app.use('/api/portal/candidates', candidatePortalRouter);

// Health check endpoints (both with and without /api prefix)
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Iraqi Election Platform API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Iraqi Election Platform API is running',
    timestamp: new Date().toISOString()
  });
});

// Main API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Iraqi Election Platform API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      social: {
        users: '/api/social/users',
        posts: '/api/social/posts',
        events: '/api/social/events',
        debates: '/api/social/debates',
        articles: '/api/social/articles'
      },
      civic: {
        dashboard: '/api/civic/stats/dashboard',
        participation: '/api/civic/stats/participation',
        governorates: '/api/civic/governorates/:slug',
        parties: '/api/civic/parties/:id'
      },
      portal: {
        candidates: '/api/portal/candidates'
      }
    }
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Iraqi Election Platform API',
    version: '1.0.0',
    docs: '/api'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
    path: req.path,
    message: 'This endpoint does not exist. Check /api for available endpoints.'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Iraqi Election Backend running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 CORS Origin: ${process.env.CORS_ORIGIN || '*'}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
