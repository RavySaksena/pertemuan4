const express = require('express');
const mongoose = require('mongoose');
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
    res.render('user/mood-tracker', {
      moods,
      editMode: false
    });
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

// GET edit mood
router.get('/edit/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;

  // Validasi apakah ID valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.warn("ID tidak valid:", id);
    return res.redirect('/mood');
  }

  try {
    const mood = await Mood.findOne({ _id: id, user: req.session.user._id });
    const moods = await Mood.find({ user: req.session.user._id }).sort({ createdAt: -1 });

    if (!mood) {
      return res.redirect('/mood');
    }

    res.render('user/mood-tracker', {
      moods,
      mood,
      editMode: true
    });
  } catch (err) {
    console.error(err);
    res.send("❌ Gagal mengambil data untuk diedit.");
  }
});

// POST update mood
router.post('/edit/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;
  const { mood, note } = req.body;

  // Validasi ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.redirect('/mood');
  }

  try {
    await Mood.updateOne(
      { _id: id, user: req.session.user._id },
      { mood, note }
    );
    res.redirect('/mood');
  } catch (err) {
    console.error(err);
    res.send("❌ Gagal mengupdate mood.");
  }
});

// POST hapus mood
router.post('/delete/:id', isAuthenticated, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.redirect('/mood');
  }

  try {
    await Mood.deleteOne({ _id: id, user: req.session.user._id });
    res.redirect('/mood');
  } catch (err) {
    console.error(err);
    res.send("❌ Gagal menghapus mood.");
  }
});

module.exports = router;
