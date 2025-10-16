const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const socketIo = require('socket.io');
const connectDB = require('./src/config/database');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Amalit Backend is running!',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/posts', require('./src/routes/posts'));
app.use('/api/teahouse', require('./src/routes/teahouse'));
app.use('/api/stories', require('./src/routes/stories'));
app.use('/api/candidates', require('./src/routes/candidates'));

require('./src/sockets/chatSocket')(io);
require('./src/sockets/notificationSocket')(io);

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Amalit Backend Server running on port ${PORT}`);
    console.log('📱 Real-time features enabled');
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
