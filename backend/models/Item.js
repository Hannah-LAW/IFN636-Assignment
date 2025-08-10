const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['lost', 'found'], required: true },
  title: { type: String, required: true },
  description: { type: String },
  campus: { type: String, enum: ['Gardens Point', 'Kelvin Grove'], required: true },
  location: { type: String },
  imageUrl: { type: String },
  status: { type: String, enum: ['pending', 'verified'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', itemSchema);