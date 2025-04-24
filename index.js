const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

const app = express();

// =======================
// Koneksi MongoDB
// =======================
mongoose.connect('mongodb://localhost:27017/mental_health_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// =======================
// Middleware
// =======================
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'superRahasiaBanget', // Ganti dengan secret yang lebih aman di production
  resave: false,
  saveUninitialized: false
}));

// Middleware session parser khusus mood (bisa dihapus kalau tidak digunakan)
app.use((req, res, next) => {
  res.locals.mood = req.session.mood || null;
  next();
});

// =======================
// View Engine
// =======================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// =======================
// Routes
// =======================
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');
const moodTrackerRoutes = require('./routes/mood-tracker');

app.use('/auth', authRoutes);
app.use('/', indexRoutes);
app.use('/mood', moodTrackerRoutes);

// =======================
// Start Server
// =======================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
