const express = require('express');
const router = express.Router();
const Journal = require('../models/journal');

// Middleware untuk cek apakah user sudah login
function isLoggedIn(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
}

// =======================
// GET: Tampilkan form buat jurnal
// =======================
router.get('/new', isLoggedIn, (req, res) => {
  res.render('user/journal-new');
});

// =======================
// POST: Simpan jurnal baru
// =======================
router.post('/', isLoggedIn, async (req, res) => {
  try {
    const { title, content } = req.body;
    await Journal.create({
      title,
      content,
      userId: req.session.user._id
    });
    res.redirect('/journal/user');
  } catch (err) {
    console.error('❌ Error simpan jurnal:', err);
    res.status(500).send('Terjadi kesalahan saat menyimpan jurnal.');
  }
});

// =======================
// GET: Tampilkan semua jurnal user
// =======================
router.get('/user', isLoggedIn, async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.session.user._id }).sort({ createdAt: -1 });
    res.render('user/journal-user', { journals });
  } catch (err) {
    console.error('❌ Error ambil jurnal:', err);
    res.status(500).send('Terjadi kesalahan saat mengambil jurnal.');
  }
});

// =======================
// PUT: Update jurnal
// =======================
router.put('/:id', isLoggedIn, async (req, res) => {
  try {
    const { title, content } = req.body;
    await Journal.findOneAndUpdate(
      { _id: req.params.id, userId: req.session.user._id },
      { title, content }
    );
    res.redirect('/journal/user');
  } catch (err) {
    console.error('❌ Error update jurnal:', err);
    res.status(500).send('Terjadi kesalahan saat mengupdate jurnal.');
  }
});

// =======================
// DELETE: Hapus jurnal
// =======================
router.delete('/:id', isLoggedIn, async (req, res) => {
  try {
    await Journal.findOneAndDelete({ _id: req.params.id, userId: req.session.user._id });
    res.redirect('/journal/user');
  } catch (err) {
    console.error('❌ Error hapus jurnal:', err);
    res.status(500).send('Terjadi kesalahan saat menghapus jurnal.');
  }
});

module.exports = router;
