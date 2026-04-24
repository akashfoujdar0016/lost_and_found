const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['student', 'faculty', 'admin'], default: 'student' },
    identifier: { type: String, required: true }, // Roll No or Faculty ID
    universityEmail: String,
    personalEmail: String,
    mobile: String,
    dateOfBirth: String,
    profilePhotoUrl: String,
    emailVerified: { type: Boolean, default: false },
    mobileVerified: { type: Boolean, default: false },
    documentVerified: { type: Boolean, default: false },
    approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastLogin: Date
});

module.exports = mongoose.model('User', userSchema);
