# GLA Lost & Found Portal

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10+-orange.svg)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-5+-purple.svg)](https://vitejs.dev/)

A modern, secure lost and found management system for GLA University with glassmorphism UI, Firebase backend, and Cloudinary image storage.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Firebase account
- Cloudinary account

### Setup

1. **Clone and Install**
```bash
cd frontend
npm install
```

2. **Configure Environment**
Create `.env` in `/frontend`:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

3. **Start Development Server**
```bash
npm run dev
```

Visit `http://localhost:5173`

## 📋 Features

### ✅ Implemented
- 🎨 Glassmorphism Landing Page
- 🔐 Advanced Authentication System
  - Multi-step registration (7 steps)
  - Role-based access (Student/Faculty)
  - Document upload with Cloudinary
  - Dual OTP verification (Email + Mobile)
- 🗄️ Firebase Firestore Database
- 🖼️ Image Upload to Cloudinary
- 🎭 Role-based Security Rules
- 👤 User Profile Management
- 📋 Faculty Verification Dashboard
- 📝 Lost/Found Item Reporting
- 🔍 Item Search & Browse
- 🚀 **Zero-Config Mock Backend:** Automatically intercepts and mocks all Firebase/Cloudinary calls into `localStorage` if `.env` keys are missing. This allows for instant deployment to Vercel/GitHub Pages with zero configuration for testing purposes!

### 🚧 In Progress
- Real-time Notifications
- Advanced Search Filters
- Mobile App Version

## 🧪 Testing

See [Authentication Testing Guide](./brain/270d8e1b-1938-43a5-a1de-121b8ac33787/auth_testing_guide.md) for detailed testing instructions.

**Quick Test:**
1. Go to `/register`
2. Complete registration (OTPs shown in browser alerts)
3. Login with your credentials

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/          # OTP Input, Document Upload
│   │   └── common/        # Protected Routes
│   ├── pages/
│   │   ├── auth/          # Login, Register
│   │   ├── Landing.jsx
│   │   ├── student/       # Student Dashboard (TODO)
│   │   └── faculty/       # Faculty Dashboard (TODO)
│   ├── services/
│   │   ├── auth.service.js      # Firebase Auth
│   │   ├── user.service.js      # User Management
│   │   ├── cloudinary.service.js # Image Upload
│   │   ├── otp.service.js       # OTP Sending
│   │   └── firestore.service.js # Database Operations
│   └── config/
│       ├── firebase.js          # Firebase Init
│       └── firebase.config.js   # Firebase Config
├── firestore.rules        # Security Rules
└── .env                   # Environment Variables

backend/ (Cloud Functions - Optional)
└── index.js              # Cloudinary Upload Functions
```

## 🔒 Security Rules

Firestore security rules include:
- Role-based access control
- User can only read/update own data
- Faculty can review verification requests
- OTP sessions are temporary

## 🎨 Design System

- **Colors**: Purple, Cyan, Pink gradients
- **Style**: Glassmorphism with backdrop blur
- **Animations**: Smooth transitions, hover effects
- **Typography**: Modern, clean fonts

## 📦 Tech Stack

### Frontend
- **React** + **Vite**
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Backend
- **Firebase Auth** - Authentication
- **Firestore** - Database
- **Cloudinary** - Image Storage
- **Firebase Functions** - Serverless (Optional)

## 🌐 Deployment

### Frontend (Vercel - Recommended)
```bash
# Build
npm run build

# Deploy to Vercel
vercel deploy
```

### Security Rules
```bash
firebase deploy --only firestore:rules
```

## 🐛 Known Issues

- OTP emails/SMS currently show in console (for testing)
- Document OCR verification not implemented (manual review)

## 🔧 Troubleshooting

### Build Errors
**Issue**: `Module not found` errors
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Vite build fails
```bash
# Solution: Check Node version (requires 18+)
node --version
# Update if needed
```

### Firebase Errors
**Issue**: `Firebase: Error (auth/configuration-not-found)`
- Verify all Firebase environment variables are set in `.env`
- Check that `.env` file is in the `frontend/` directory
- Restart dev server after changing `.env`

**Issue**: `Missing or insufficient permissions`
- Deploy Firestore security rules: `firebase deploy --only firestore:rules`
- Check that user is authenticated before accessing protected routes

### Cloudinary Upload Issues
**Issue**: Image upload fails
- Verify Cloudinary credentials in backend `.env`
- Check that backend functions are deployed
- Ensure CORS is configured in Cloudinary dashboard

### Common Setup Issues
**Issue**: `Cannot find module 'firebase'`
```bash
cd frontend
npm install firebase
```

**Issue**: Port 5173 already in use
```bash
# Use different port
npm run dev -- --port 3000
```

## 📝 License

MIT License - See [LICENSE](./LICENSE) file for details

## 👥 Contributors

Built for GLA University Lost & Found Portal

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

**Need Help?** Open an issue or check existing documentation in the repository.

