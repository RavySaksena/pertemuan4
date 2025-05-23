const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');
const flash = require('connect-flash');
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
app.use(methodOverride('_method'));


app.use(session({
  secret: 'superRahasiaBanget', // Ganti dengan yang aman di production
  resave: false,
  saveUninitialized: false
}));

  // Flash middleware AFTER session
app.use(flash());

// Global middleware (UPDATED to include flash)
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  
  if (req.session.user) {
    res.locals.user = req.session.user;
  } else {
    res.locals.user = null;
  }

  res.locals.mood = req.session.mood || null;
  next();
});

// Middleware global: inject user dan mood ke semua view
app.use((req, res, next) => {
  if (req.session.user) {
    req.user = req.session.user;
    res.locals.user = req.session.user;
  } else {
    req.user = null;
    res.locals.user = null;
  }

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
const journalRoutes = require('./routes/journal');
const todosRoutes = require('./routes/todos');

app.use('/auth', authRoutes);
app.use('/', indexRoutes);
app.use('/mood', moodTrackerRoutes);
app.use('/journal', journalRoutes);
app.use('/todos', todosRoutes);


// =======================
// Start Server
// =======================
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
