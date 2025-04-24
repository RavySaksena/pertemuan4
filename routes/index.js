const express = require('express');
const router = express.Router();

// Middleware auth untuk memastikan user sudah login
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/auth/login');
}

// GET / (halaman dashboard)
router.get('/', isAuthenticated, (req, res) => {
  // Log session user (opsional untuk debug)
  console.log("🔐 Session User:", req.session.user);

  // Render dashboard jika user sudah login
  res.render('user/dashboard', { user: req.session.user });
});

module.exports = router;
