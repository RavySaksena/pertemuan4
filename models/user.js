const mongoose = require('mongoose');

// Cek apakah model 'User' sudah ada, agar tidak terjadi OverwriteModelError
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  fullname: { type: String, required: true },
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}));

module.exports = User;
