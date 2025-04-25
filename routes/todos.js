const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');

// Middleware untuk cek login
function isLoggedIn(req, res, next) {
  if (req.session.user) {
    return next();
  }
  req.flash('error_msg', 'Silakan login terlebih dahulu');
  res.redirect('/auth/login');
}

// =======================
// GET: Tampilkan semua todo
// =======================
router.get('/', isLoggedIn, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.session.user._id })
                          .sort({ createdAt: -1 });
    
    res.render('user/todos', {
      todos,
      success_msg: req.flash('success_msg'),
      error_msg: req.flash('error_msg')
    });

  } catch (err) {
    console.error('❌ Error mengambil todo:', err);
    req.flash('error_msg', 'Gagal memuat daftar todo');
    res.redirect('/todos'); // Diubah ke dashboard
  }
});

// =======================
// POST: Tambah todo baru
// =======================
router.post('/', isLoggedIn, async (req, res) => {
  try {
    const { task } = req.body;
    
    // Validasi input
    if (!task || task.trim() === '') {
      req.flash('error_msg', 'Task tidak boleh kosong');
      return res.redirect('/todos'); // Tetap di todos untuk error validation
    }

    if (task.length > 100) {
      req.flash('error_msg', 'Task maksimal 100 karakter');
      return res.redirect('/todos'); // Tetap di todos untuk error validation
    }

    await Todo.create({
      task: task.trim(),
      userId: req.session.user._id,
      completed: false
    });

    req.flash('success_msg', 'Todo berhasil ditambahkan');
    res.redirect('/todos'); // Diubah ke dashboard setelah sukses

  } catch (err) {
    console.error('❌ Error menambah todo:', err);
    req.flash('error_msg', 'Gagal menambahkan todo');
    res.redirect('/todos'); // Diubah ke dashboard
  }
});

// =======================
// PUT: Tandai todo selesai
// =======================
router.put('/complete/:id', isLoggedIn, async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { 
        _id: req.params.id, 
        userId: req.session.user._id 
      },
      { completed: true },
      { new: true }
    );

    if (!todo) {
      req.flash('error_msg', 'Todo tidak ditemukan');
      return res.redirect('/todos'); // Diubah ke dashboard
    }

    req.flash('success_msg', 'Todo berhasil ditandai selesai');
    res.redirect('/todos'); // Diubah ke dashboard

  } catch (err) {
    console.error('❌ Error menyelesaikan todo:', err);
    req.flash('error_msg', 'Gagal menandai todo selesai');
    res.redirect('/todos'); // Diubah ke dashboard
  }
});

// =======================
// DELETE: Hapus todo
// =======================
router.delete('/:id', isLoggedIn, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ 
      _id: req.params.id,
      userId: req.session.user._id 
    });

    if (!todo) {
      req.flash('error_msg', 'Todo tidak ditemukan');
      return res.redirect('/todos'); // Diubah ke dashboard
    }

    req.flash('success_msg', 'Todo berhasil dihapus');
    res.redirect('/todos'); // Diubah ke dashboard

  } catch (err) {
    console.error('❌ Error menghapus todo:', err);
    req.flash('error_msg', 'Gagal menghapus todo');
    res.redirect('/todos'); // Diubah ke dashboard
  }
});


module.exports = router;