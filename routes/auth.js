const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require('../models/user');

// =======================
// GET: Login Page
// =======================
router.get("/login", (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('user/login');
});

// =======================
// POST: Handle Login
// =======================
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (user && await bcrypt.compare(password, user.password)) {
      req.session.user = user;
      return res.redirect('/');
    }

    res.render("user/login", {
      error: "Username/email atau password salah"
    });
  } catch (err) {
    console.error(err);
    res.render("user/login", {
      error: "Terjadi kesalahan server"
    });
  }
});

// =======================
// GET: Register Page
// =======================
router.get("/register", (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render('user/register');
});

// =======================
// POST: Handle Register
// =======================
router.post("/register", async (req, res) => {
  const { fullname, email, username, password } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.render("user/register", {
        error: "Username atau email sudah digunakan"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      email,
      username,
      password: hashedPassword
    });

    await newUser.save();

    req.session.user = newUser;
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render("user/register", {
      error: "Terjadi kesalahan pada server"
    });
  }
});

// =======================
// GET: Logout
// =======================
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("❌ Error saat logout:", err);
      return res.redirect('/');
    }

    res.clearCookie('connect.sid'); // Hapus cookie session
    res.redirect('/auth/login'); // Redirect ke halaman login
  });
});

module.exports = router;
