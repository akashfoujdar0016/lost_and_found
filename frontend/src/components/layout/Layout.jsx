import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Home, Search, PlusCircle, User, ShieldCheck, Shield,
    LogOut, Menu, X, Sparkles
} from 'lucide-react';

export const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const studentLinks = [
        { to: '/student/dashboard', icon: <Home size={16} />, label: 'Dashboard' },
        { to: '/student/search', icon: <Search size={16} />, label: 'Search' },
        { to: '/student/report', icon: <PlusCircle size={16} />, label: 'Report Item' },
        { to: '/student/activity', icon: <User size={16} />, label: 'Submissions' },
        { to: '/student/profile', icon: <Shield size={16} />, label: 'Profile' },
    ];

    const facultyLinks = [
        { to: '/faculty/dashboard', icon: <Home size={16} />, label: 'Overview' },
        { to: '/faculty/verify', icon: <ShieldCheck size={16} />, label: 'Verify Queue' },
        { to: '/faculty/items-queue', icon: <User size={16} />, label: 'Items Queue' },
        { to: '/faculty/search', icon: <Search size={16} />, label: 'Search' },
        { to: '/faculty/profile', icon: <Shield size={16} />, label: 'Profile' },
    ];

    const links = user?.role === 'faculty' ? facultyLinks : studentLinks;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white relative overflow-x-hidden flex flex-col font-sans selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]">
            {/* Massive Deep Radial Mesh Gradient Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#0a1128]/70 blur-[180px] rounded-full"></div>
                <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-[#00E5FF]/[0.03] blur-[160px] rounded-full"></div>
                <div className="absolute inset-0 bg-radial-dot-pattern opacity-40"></div>
            </div>

            {/* Floating Top Navigation Dock */}
            <header className="fixed top-6 left-0 right-0 z-50 px-4 sm:px-8">
                <nav className="mx-auto max-w-6xl px-6 py-3.5 flex items-center justify-between rounded-full bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.06] shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-300 hover:border-white/10">
                    {/* Brand Identifier */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] shadow-[0_0_12px_#00E5FF]"></div>
                        <span className="font-extrabold text-xs tracking-[0.2em] text-white uppercase">
                            GLA <span className="text-[#00E5FF]">NETWORK</span>
                        </span>
                    </div>

                    {/* Navigation Pills (Desktop) */}
                    <div className="hidden md:flex items-center gap-1.5 bg-white/[0.02] p-1 rounded-full border border-white/[0.04]">
                        {links.map(link => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${isActive
                                        ? 'bg-white/10 text-white shadow-[0_4px_20px_rgba(0,0,0,0.4)] border border-white/10'
                                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className={isActive ? 'text-[#00E5FF]' : 'text-slate-500'}>{link.icon}</span>
                                        <span>{link.label}</span>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>

                    {/* User Profile & Human Log Out */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-xs font-bold text-[#00E5FF]">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="text-left leading-tight">
                                <span className="block text-xs font-bold text-white truncate max-w-[110px]">{user?.name || 'Student'}</span>
                                <span className="block text-[10px] text-slate-400 font-mono capitalize">{user?.role || 'User'}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 text-slate-300 hover:text-rose-400 text-xs font-medium transition-all duration-300"
                        >
                            <LogOut size={13} />
                            <span>Log Out</span>
                        </button>
                    </div>

                    {/* Mobile Hamburger Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-full bg-white/5 border border-white/10 text-white"
                    >
                        {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </nav>

                {/* Mobile Floating Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-3 max-w-sm mx-auto p-6 rounded-3xl bg-[#0c0e14]/95 border border-white/10 backdrop-blur-[30px] shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] flex items-center justify-center font-bold text-xs">
                                    {user?.name?.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">{user?.name}</p>
                                    <p className="text-[10px] text-slate-400 capitalize">{user?.role}</p>
                                </div>
                            </div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-[#00E5FF] bg-[#00E5FF]/10 px-2 py-0.5 rounded-full">
                                Active
                            </span>
                        </div>

                        <nav className="space-y-1.5">
                            {links.map(link => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive
                                            ? 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 font-bold'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`
                                    }
                                >
                                    {link.icon} {link.label}
                                </NavLink>
                            ))}
                        </nav>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold transition-all"
                        >
                            <LogOut size={14} /> Log Out
                        </button>
                    </div>
                )}
            </header>

            {/* Main Floating Content Space */}
            <main className="relative z-10 flex-1 pt-28 pb-16 px-4 sm:px-8 max-w-6xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
};
