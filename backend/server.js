require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
const Item = require('./models/Item');
const User = require('./models/User');
const Claim = require('./models/Claim');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Auth Middleware
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Failed to authenticate token' });
        req.user = decoded;
        next();
    });
};

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// MongoDB Connection
const mongodbUri = process.env.MONGODB_URI;
if (!mongodbUri) {
    console.error('MONGODB_URI is not defined in .env file');
} else {
    mongoose.connect(mongodbUri)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('MongoDB connection error:', err));
}

// Health Check Route
app.get('/api/health', async (req, res) => {
    res.json({
        status: 'ok',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        env: {
            has_mongo_uri: !!process.env.MONGODB_URI,
            has_jwt_secret: !!process.env.JWT_SECRET,
            node_env: process.env.NODE_ENV
        }
    });
});

// --- Routes ---

// Items Routes
app.get('/api/items', async (req, res) => {
    try {
        const { type, category, status } = req.query;
        const filter = {};
        if (type) filter.type = type;
        if (category) filter.category = category;
        if (status) filter.status = status;

        const items = await Item.find(filter)
            .populate('reportedBy', 'name email identifier')
            .sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/items/latest', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3;
        const items = await Item.find()
            .populate('reportedBy', 'name email identifier')
            .sort({ createdAt: -1 })
            .limit(limit);
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id)
            .populate('reportedBy', 'name email identifier')
            .populate('claimedBy', 'name email');
        if (!item) return res.status(404).json({ error: 'Item not found' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/items', verifyToken, async (req, res) => {
    try {
        const newItem = new Item({
            ...req.body,
            reportedBy: req.user.id // Use ID from token for security
        });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.patch('/api/items/:id/status', verifyToken, async (req, res) => {
    try {
        const { status } = req.body;
        const item = await Item.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: Date.now() },
            { new: true }
        );
        res.json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/items/:id', verifyToken, async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/users/:userId/reports', async (req, res) => {
    try {
        const items = await Item.find({ reportedBy: req.params.userId }).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Claims Routes
app.post('/api/claims', verifyToken, async (req, res) => {
    try {
        const newClaim = new Claim({
            ...req.body,
            claimantId: req.user.id
        });
        await newClaim.save();
        res.status(201).json(newClaim);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/claims/pending', async (req, res) => {
    try {
        const claims = await Claim.find({ status: 'pending' }).populate('itemId').sort({ createdAt: -1 });
        res.json(claims);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/claims/:id/verify', verifyToken, async (req, res) => {
    try {
        const { decision, note } = req.body;
        const claim = await Claim.findById(req.params.id);
        if (!claim) return res.status(404).json({ error: 'Claim not found' });

        claim.status = decision;
        claim.verificationNote = note;
        claim.verifiedAt = Date.now();
        claim.updatedAt = Date.now();
        await claim.save();

        if (decision === 'approved') {
            await Item.findByIdAndUpdate(claim.itemId, {
                status: 'claimed',
                claimedBy: claim.claimantId,
                claimedAt: Date.now(),
                updatedAt: Date.now()
            });
        }

        res.json({ success: true, claim });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/users/:userId/claims', async (req, res) => {
    try {
        const claims = await Claim.find({ claimantId: req.params.userId }).populate('itemId').sort({ createdAt: -1 });
        res.json(claims);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Image Upload Routes (Cloudinary)
app.post('/api/upload', verifyToken, async (req, res) => {
    try {
        const { imageBase64, folder = 'lost-found' } = req.body;
        if (!imageBase64) return res.status(400).json({ error: 'Image data is required' });

        const result = await cloudinary.uploader.upload(imageBase64, {
            folder: folder,
            resource_type: 'auto',
            transformation: [
                { width: 1200, height: 1200, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' }
            ]
        });

        res.json({
            success: true,
            url: result.secure_url,
            publicId: result.public_id
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, name, role, identifier, ...rest } = req.body;
        
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: 'User already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        user = new User({
            email,
            password: hashedPassword,
            name,
            role,
            identifier,
            ...rest
        });

        await user.save();

        // Create token
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        
        res.status(201).json({ token, user: { id: user._id, email, name, role } });
    } catch (error) {
        console.error('Registration Error Details:', error);
        res.status(500).json({ 
            error: error.message,
            details: error.errors ? Object.keys(error.errors).map(key => error.errors[key].message) : null
        });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
        
        res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// User Management Routes
app.get('/api/users/check/:identifier', async (req, res) => {
    try {
        const { identifier } = req.params;
        const { role } = req.query;
        const user = await User.findOne({ identifier, role });
        res.json({ exists: !!user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/users/sync', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { ...userData } = req.body;

        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Update fields that are provided
        Object.keys(userData).forEach(key => {
            if (userData[key] !== undefined) {
                user[key] = userData[key];
            }
        });
        user.updatedAt = Date.now();
        await user.save();
        
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/users/lookup', async (req, res) => {
    try {
        const { identifier } = req.query;
        if (!identifier) return res.status(400).json({ error: 'Identifier is required' });

        const user = await User.findOne({
            $or: [
                { email: identifier },
                { universityEmail: identifier },
                { identifier: identifier },
                { mobile: identifier }
            ]
        });

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json({ email: user.email });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Export the app for Vercel
module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

