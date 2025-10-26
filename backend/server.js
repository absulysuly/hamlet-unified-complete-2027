const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://iraq-election.vercel.app'
}));
app.use(express.json());

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Iraqi Election Platform API is running',
    timestamp: new Date().toISOString()
  });
});

// Main API route
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Iraqi Election Platform API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      candidates: '/api/candidates (coming soon)',
      elections: '/api/elections (coming soon)'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(\🚀 Iraqi Election Backend running on port \\);
  console.log(\🌐 Environment: \\);
  console.log(\🔗 CORS Origin: \\);
});

module.exports = app;
