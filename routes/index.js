const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // 🔧 Tambahkan log biar tau sessionnya kebaca atau enggak
  console.log("🔐 Session User:", req.session.user);

  // ⛔️ Kalau belum login, balikin ke login
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }

  // ✅ Kalau sudah login, tampilkan dashboard
  res.render('user/dashboard', { user: req.session.user });
});

module.exports = router;
