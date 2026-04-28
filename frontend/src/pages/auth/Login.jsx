import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, ArrowLeft, GraduationCap, Building2, Lock, Mail } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    const [activeTab, setActiveTab] = useState('student'); // 'student' or 'faculty'

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // UI States
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setEmail('');
        setPassword('');
        setError('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await loginWithEmail(email.trim(), password);
            
            if (result.success) {
                await refreshUser(); // Update the AuthContext with the new user session
                // Check if the user's role matches the selected tab
                if (result.user.role !== activeTab) {
                    throw new Error(`Unauthorized access. This account is registered as a ${result.user.role}.`);
                }
                navigate(`/${activeTab}/dashboard`);
            }
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-radial from-gray-800 via-gray-900 to-[#0b0f1a] text-white overflow-x-hidden">
            {/* Animated Background Blurs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-40 right-0 w-80 h-80 bg-cyan-400/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
            </div>


            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="absolute top-8 left-8 flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
                >
                    <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
                    <span>Back to Home</span>
                </button>

                {/* Login Card */}
                <div className="w-full max-w-md">
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                                Welcome Back
                            </h1>
                            <p className="text-white/60 text-sm">
                                Access your GLA Lost & Found account
                            </p>
                        </div>

                        {/* Role Switcher */}
                        <div className="flex bg-white/5 p-1.5 rounded-2xl mb-8">
                            <button
                                onClick={() => handleTabChange('student')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${activeTab === 'student'
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                                    : 'text-white/40 hover:text-white/60'
                                    }`}
                            >
                                <GraduationCap size={18} />
                                <span className="font-semibold">Student</span>
                            </button>
                            <button
                                onClick={() => handleTabChange('faculty')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${activeTab === 'faculty'
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                    : 'text-white/40 hover:text-white/60'
                                    }`}
                            >
                                <Building2 size={18} />
                                <span className="font-semibold">Faculty</span>
                            </button>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-300 animate-shake">
                                <AlertCircle size={20} className="shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={handleLogin} className="space-y-5">
                            {/* Email Input */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-white/80">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-300/20 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-white/80">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-300/20 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3 rounded-xl text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${activeTab === 'student'
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-cyan-500/20'
                                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:shadow-purple-500/20'
                                    }`}
                            >
                                {isLoading ? 'Authenticating...' : 'Sign In'}
                            </button>
                        </form>

                        {/* Sign Up Link */}
                        <div className="mt-8 text-center pt-6 border-t border-white/10">
                            <p className="text-white/60 text-sm">
                                First time user?{' '}
                                <button
                                    onClick={() => navigate('/register')}
                                    className="text-cyan-300 hover:text-cyan-200 font-semibold transition-colors"
                                >
                                    Register Here
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
