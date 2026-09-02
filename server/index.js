require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const { authenticate } = require('./middleware/auth');
const publicRoutes = require('./routes/public');
const authRoutes = require('./routes/auth');
const storiesRoutes = require('./routes/stories');
const landingRoutes = require('./routes/landing');
const messagesRoutes = require('./routes/messages');
const mediaRoutes = require('./routes/media');
const categoriesRoutes = require('./routes/categories');
const locationsRoutes = require('./routes/locations');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'", "https://unpkg.com", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", process.env.SUPABASE_URL].filter(Boolean),
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false
}));

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));

const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', generalLimiter);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/stories', storiesRoutes);
app.use('/api/landing', landingRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/locations', locationsRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Something went wrong on our end.' });
});

app.listen(PORT, () => {
  console.log(`Hope Beyond Shores server running on port 'http://localhost:${PORT}'`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
