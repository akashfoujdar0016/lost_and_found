import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithEmail } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, ArrowLeft, GraduationCap, Building2, Lock, Mail } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    const [activeTab, setActiveTab] = useState('student');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
                await refreshUser();
                if (result.user.role !== activeTab) {
                    throw new Error(`Unauthorized role access. Account registered as ${result.user.role}.`);
                }
                navigate(`/${activeTab}/dashboard`);
            }
        } catch (err) {
            setError(err.message || 'Authentication failed. Please verify credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#090b0e] text-slate-100 bg-grid-pattern relative overflow-x-hidden flex flex-col justify-center items-center p-6">
            {/* Navigation Back */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors group"
            >
                <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={16} />
                <span>Return to Portal</span>
            </button>

            {/* Login Container Card */}
            <div className="w-full max-w-md">
                <div className="rounded-3xl bg-[#11141b]/90 border border-white/[0.08] p-8 md:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
                    {/* Header */}
                    <div className="text-center mb-8 space-y-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400 bg-sky-400/10 px-3 py-1 rounded border border-sky-400/20">
                            Authentication Protocol
                        </span>
                        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                            Portal Sign In
                        </h1>
                        <p className="text-slate-400 text-xs">
                            Enter credentials to access GLA Lost & Found Workspace
                        </p>
                    </div>

                    {/* Role Switcher */}
                    <div className="flex bg-[#161a24] p-1.5 rounded-xl border border-white/[0.06] mb-8">
                        <button
                            type="button"
                            onClick={() => handleTabChange('student')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all ${
                                activeTab === 'student'
                                    ? 'bg-sky-400 text-slate-950 shadow-md'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <GraduationCap size={16} />
                            <span>Student</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleTabChange('faculty')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all ${
                                activeTab === 'faculty'
                                    ? 'bg-sky-400 text-slate-950 shadow-md'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <Building2 size={16} />
                            <span>Faculty</span>
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-300 text-xs">
                            <AlertCircle size={18} className="shrink-0" />
                            <p className="font-semibold">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                                Institutional Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="e.g. student@gla.ac.in"
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 bg-[#161a24] border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/20 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                                Account Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-11 pr-4 py-3.5 bg-[#161a24] border border-white/10 rounded-xl text-white placeholder-slate-500 text-xs focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/20 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 rounded-xl bg-sky-400 text-slate-950 font-extrabold text-xs uppercase tracking-widest hover:bg-sky-300 transition-all shadow-[0_15px_30px_rgba(56,189,248,0.2)] active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? 'Authenticating...' : 'Authenticate & Enter'}
                        </button>
                    </form>

                    {/* Footer register link */}
                    <div className="mt-8 text-center pt-6 border-t border-white/[0.08]">
                        <p className="text-slate-400 text-xs">
                            New to GLA Portal?{' '}
                            <button
                                onClick={() => navigate('/register')}
                                className="text-sky-400 font-bold hover:text-sky-300 transition-colors uppercase tracking-wider ml-1"
                            >
                                Register Identity
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
