const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, required: true }, // remove enum
    // image: { type: String, required: false },
    campus: { type: String, default: 'Gardens Point' }, // remove enum
    location: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    lastAction: { type: String, enum: ['User added item', 'User edited item', 'User deleted item'], default: 'User added item' },
    deadline: { type: Date }
});

module.exports = mongoose.model('Item', itemSchema);
