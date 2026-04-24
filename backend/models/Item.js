const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    category: { type: String, required: true },
    type: { type: String, enum: ['lost', 'found'], required: true },
    location: { type: String, required: true },
    date: { type: Date, default: Date.now },
    images: { type: [String], default: [] },
    status: { type: String, enum: ['active', 'open', 'claimed', 'closed', 'resolved', 'deleted'], default: 'active' },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User ID
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User ID
    lastTimeSeen: String,
    color: String,
    views: { type: Number, default: 0 },
    matchedWith: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', itemSchema);
