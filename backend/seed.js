require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Item = require('./models/Item');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('MONGODB_URI is not defined in .env file');
    process.exit(1);
}

const seedData = async () => {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany({});
        await Item.deleteMany({});
        console.log('Cleared existing data.');

        // 1. Create Users
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        const users = await User.insertMany([
            {
                name: 'System Faculty',
                universityEmail: 'faculty@gla.ac.in',
                personalEmail: 'faculty.test@gmail.com',
                password: hashedPassword,
                role: 'faculty',
                identifier: 'FAC001',
                mobile: '9876543210',
                emailVerified: true
            },
            {
                name: 'John Student',
                universityEmail: 'john.student@gla.ac.in',
                personalEmail: 'john.test@gmail.com',
                password: hashedPassword,
                role: 'student',
                identifier: '2115000123',
                mobile: '9876543211',
                emailVerified: true
            }
        ]);
        console.log('Created test users.');

        const facultyId = users[0]._id;
        const studentId = users[1]._id;

        // 2. Create Items
        const items = await Item.insertMany([
            {
                title: 'Blue Water Bottle',
                description: 'Milton blue water bottle left in Library.',
                category: 'Accessories',
                type: 'found',
                status: 'active',
                location: 'Library, 2nd Floor',
                color: 'Blue',
                reportedBy: facultyId,
                images: ['https://placehold.co/600x400?text=Blue+Bottle'],
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
            },
            {
                title: 'Mechanical Pencil',
                description: 'Rotring 0.5mm mechanical pencil.',
                category: 'Stationery',
                type: 'lost',
                status: 'active',
                location: 'Academic Block A',
                color: 'Black',
                reportedBy: studentId,
                images: [],
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
            }
        ]);
        console.log('Created test items.');

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
