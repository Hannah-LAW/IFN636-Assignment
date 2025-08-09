const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  Campus: { type: String, enum: ['Gardens Point', 'Kelvin Grove'], required: true },
  Location: String,
  imageUrl: String,
  reportedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['lost', 'found', 'matched'], default: 'lost' },
});

module.exports = mongoose.model('LostItem', lostItemSchema);
