const express = require('express');
const router = express.Router();
const Mood = require('../models/mood');

// Middleware auth
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/auth/login');
}

// GET mood tracker & tampilkan riwayat
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const moods = await Mood.find({ user: req.session.user._id }).sort({ createdAt: -1 });
    res.render('user/mood-tracker', { moods });
  } catch (err) {
    console.error(err);
    res.send("❌ Gagal mengambil data mood.");
  }
});

// POST simpan mood baru
router.post('/save', isAuthenticated, async (req, res) => {
  const { mood, note } = req.body;

  try {
    const newMood = new Mood({
      user: req.session.user._id,
      mood,
      note
    });

    await newMood.save();
    res.redirect('/mood');
  } catch (err) {
    console.error(err);
    res.send("❌ Gagal menyimpan mood.");
  }
});

// POST hapus mood berdasarkan ID
router.post('/delete/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;

  try {
    await Mood.deleteOne({ _id: id, user: req.session.user._id });
    res.redirect('/mood');
  } catch (err) {
    console.error(err);
    res.send("❌ Gagal menghapus mood.");
  }
});

module.exports = router;
