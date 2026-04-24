const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Added for local auth
    uid: { type: String, unique: true, sparse: true }, // Optional: Keep for compatibility during transition
    displayName: String,
    name: String,
    photoURL: String,
    profilePhotoUrl: String,
    phoneNumber: String,
    mobile: String,
    rollNumber: String,
    identifier: String,
    role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },
    emailVerified: { type: Boolean, default: false },
    mobileVerified: { type: Boolean, default: false },
    documentVerified: { type: Boolean, default: false },
    approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastLogin: Date
});

module.exports = mongoose.model('User', userSchema);
