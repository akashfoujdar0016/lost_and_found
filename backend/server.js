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
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.options('*', cors());
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

// Mongoose Configuration & Connection Caching Helper for Serverless
mongoose.set('bufferCommands', false);

let cachedDbPromise = null;

const connectToDatabase = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    const mongodbUri = process.env.MONGODB_URI;
    if (!mongodbUri) {
        throw new Error('MONGODB_URI environment variable is not defined in Vercel settings.');
    }

    if (!cachedDbPromise) {
        cachedDbPromise = mongoose.connect(mongodbUri, {
            serverSelectionTimeoutMS: 10000
        });
    }

    try {
        await cachedDbPromise;
    } catch (err) {
        cachedDbPromise = null;
        throw err;
    }

    return mongoose.connection;
};

// Database Connection Health Middleware
const checkDbConnection = async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (error) {
        console.error('Database Connection Failure:', error);
        return res.status(503).json({
            error: error.message || 'Database connection unavailable. Please check MONGODB_URI environment variable in Vercel settings.'
        });
    }
};

// Health Check Route (responds to both /api/health and /health)
app.get(['/api/health', '/health'], async (req, res) => {
    try {
        await connectToDatabase();
        res.json({
            status: 'ok',
            database: 'connected',
            readyState: mongoose.connection.readyState,
            env: {
                has_mongo_uri: !!process.env.MONGODB_URI,
                has_jwt_secret: !!process.env.JWT_SECRET,
                node_env: process.env.NODE_ENV?.trim()
            }
        });
    } catch (err) {
        res.json({
            status: 'degraded',
            database: 'disconnected',
            error: err.message,
            readyState: mongoose.connection.readyState,
            env: {
                has_mongo_uri: !!process.env.MONGODB_URI,
                has_jwt_secret: !!process.env.JWT_SECRET,
                node_env: process.env.NODE_ENV?.trim()
            }
        });
    }
});

// --- Routes ---

// Items Routes
app.get(['/api/items', '/items'], async (req, res) => {
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

app.get(['/api/items/latest', '/items/latest'], async (req, res) => {
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

app.get(['/api/items/:id', '/items/:id'], async (req, res) => {
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

app.post(['/api/items', '/items'], verifyToken, async (req, res) => {
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

app.patch(['/api/items/:id/status', '/items/:id/status'], verifyToken, async (req, res) => {
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

app.delete(['/api/items/:id', '/items/:id'], verifyToken, async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get(['/api/users/:userId/reports', '/users/:userId/reports'], async (req, res) => {
    try {
        const items = await Item.find({ reportedBy: req.params.userId }).sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Claims Routes
app.post(['/api/claims', '/claims'], verifyToken, async (req, res) => {
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

app.get(['/api/claims/pending', '/claims/pending'], async (req, res) => {
    try {
        const claims = await Claim.find({ status: 'pending' }).populate('itemId').sort({ createdAt: -1 });
        res.json(claims);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post(['/api/claims/:id/verify', '/claims/:id/verify'], verifyToken, async (req, res) => {
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

app.get(['/api/users/:userId/claims', '/users/:userId/claims'], async (req, res) => {
    try {
        const claims = await Claim.find({ claimantId: req.params.userId }).populate('itemId').sort({ createdAt: -1 });
        res.json(claims);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Image Upload Routes (Cloudinary)
app.post(['/api/upload', '/upload'], verifyToken, async (req, res) => {
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
app.post(['/api/auth/register', '/auth/register', '/register'], checkDbConnection, async (req, res) => {
    try {
        const { email, password, name, role, identifier, universityEmail, personalEmail, ...rest } = req.body;
        
        if (!email || !password || !name || !identifier) {
            return res.status(400).json({ error: 'Please provide all required registration fields' });
        }

        const cleanEmail = email.toLowerCase().trim();
        const cleanUniEmail = (universityEmail || email).toLowerCase().trim();
        const cleanPersonalEmail = (personalEmail || email).toLowerCase().trim();
        const cleanIdentifier = identifier.trim();

        // Check if user exists by email, university email, personal email, or roll no/faculty ID
        const existingUser = await User.findOne({
            $or: [
                { email: cleanEmail },
                { universityEmail: cleanUniEmail },
                { personalEmail: cleanPersonalEmail },
                { identifier: cleanIdentifier }
            ]
        });

        if (existingUser) {
            return res.status(400).json({ error: 'An account with this Email or Roll No / Faculty ID already exists. Please Sign In.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = new User({
            email: cleanEmail,
            universityEmail: cleanUniEmail,
            personalEmail: cleanPersonalEmail,
            password: hashedPassword,
            name: name.trim(),
            role: role || 'student',
            identifier: cleanIdentifier,
            ...rest
        });

        await user.save();

        // Create token
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        
        res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role, identifier: user.identifier } });
    } catch (error) {
        console.error('Registration Error Details:', error);
        if (error.code === 11000) {
            return res.status(400).json({ error: 'An account with this Email or Roll No / Faculty ID already exists' });
        }
        res.status(500).json({ 
            error: error.message || 'Server error during registration',
            details: error.errors ? Object.keys(error.errors).map(key => error.errors[key].message) : null
        });
    }
});

app.post(['/api/auth/login', '/auth/login', '/login'], checkDbConnection, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const cleanSearch = email.toLowerCase().trim();
        const user = await User.findOne({
            $or: [
                { email: cleanSearch },
                { universityEmail: cleanSearch },
                { personalEmail: cleanSearch },
                { identifier: email.trim() }
            ]
        });
        
        if (!user) return res.status(400).json({ error: 'Invalid credentials. User not found.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials. Incorrect password.' });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        
        res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role, identifier: user.identifier } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// User Management Routes
app.get(['/api/users/me', '/users/me', '/api/users/profile', '/users/profile'], checkDbConnection, verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User profile not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get(['/api/users/check/:identifier', '/users/check/:identifier'], async (req, res) => {
    try {
        const { identifier } = req.params;
        const { role } = req.query;
        const user = await User.findOne({ identifier, role });
        res.json({ exists: !!user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post(['/api/users/sync', '/users/sync'], checkDbConnection, verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { uid, _id, password, ...userData } = req.body;

        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Update valid fields that are provided
        const allowedFields = ['name', 'mobile', 'dateOfBirth', 'profilePhotoUrl', 'universityEmail', 'personalEmail', 'identifier', 'emailVerified', 'mobileVerified'];
        allowedFields.forEach(key => {
            if (userData[key] !== undefined) {
                user[key] = userData[key];
            }
        });
        user.updatedAt = Date.now();
        await user.save();
        
        res.json(user);
    } catch (error) {
        console.error('Error syncing user profile:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get(['/api/users/lookup', '/users/lookup'], async (req, res) => {
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

