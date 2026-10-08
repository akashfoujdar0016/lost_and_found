import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Home, Search, PlusCircle, User, ShieldCheck, Shield,
    LogOut
} from 'lucide-react';

export const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const studentLinks = [
        { to: '/student/dashboard', icon: <Home size={18} />, label: 'Dashboard' },
        { to: '/student/search', icon: <Search size={18} />, label: 'Search' },
        { to: '/student/report', icon: <PlusCircle size={20} />, label: 'Report', primary: true },
        { to: '/student/activity', icon: <User size={18} />, label: 'Submissions' },
        { to: '/student/profile', icon: <Shield size={18} />, label: 'Profile' },
    ];

    const facultyLinks = [
        { to: '/faculty/dashboard', icon: <Home size={18} />, label: 'Overview' },
        { to: '/faculty/verify', icon: <ShieldCheck size={18} />, label: 'Verify' },
        { to: '/faculty/items-queue', icon: <User size={18} />, label: 'Queue' },
        { to: '/faculty/search', icon: <Search size={18} />, label: 'Search' },
        { to: '/faculty/profile', icon: <Shield size={18} />, label: 'Profile' },
    ];

    const links = user?.role === 'faculty' ? facultyLinks : studentLinks;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white relative overflow-x-hidden flex flex-col font-sans selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]">
            {/* Deep Radial Mesh Gradient Background for Infinite Depth */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(900px,100vw)] h-[min(900px,100vw)] bg-[#0a1128]/70 blur-[180px] rounded-full"></div>
                <div className="absolute top-0 left-1/3 w-[min(500px,100vw)] h-[min(500px,100vw)] bg-[#00E5FF]/[0.03] blur-[160px] rounded-full"></div>
                <div className="absolute inset-0 bg-radial-dot-pattern opacity-40"></div>
            </div>

            {/* Desktop Top Floating Glass Navigation Dock */}
            <header className="fixed top-5 left-0 right-0 z-50 px-4 sm:px-8">
                <nav className="mx-auto max-w-6xl px-6 py-3.5 flex items-center justify-between rounded-full bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.05] shadow-[0_30px_60px_-15px_rgba(0,229,255,0.08)] transition-all duration-300 hover:border-white/10">
                    {/* Brand Identifier */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] shadow-[0_0_12px_#00E5FF]"></div>
                        <span className="font-extrabold text-xs tracking-[0.2em] text-white uppercase">
                            GLA <span className="text-[#00E5FF]">LOST &amp; FOUND</span>
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
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-xs font-bold text-[#00E5FF]">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="hidden sm:block text-left leading-tight">
                                <span className="block text-xs font-bold text-white truncate max-w-[110px]">{user?.name || 'Student'}</span>
                                <span className="block text-[10px] text-slate-400 font-mono capitalize">{user?.role || 'User'}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/30 text-slate-300 hover:text-rose-400 text-xs font-medium transition-all duration-300"
                        >
                            <LogOut size={13} />
                            <span className="hidden sm:inline">Log Out</span>
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Bottom Floating Glass Dock (iOS App Style) */}
            <div className="md:hidden fixed bottom-5 left-4 right-4 z-50">
                <nav className="px-3 py-2 rounded-full bg-[#0c0e14]/90 backdrop-blur-[24px] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex items-center justify-around">
                    {links.map(link => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `flex flex-col items-center gap-1 p-2 rounded-full transition-all duration-300 ${
                                    link.primary
                                        ? 'bg-[#00E5FF] text-slate-950 p-3 -mt-4 shadow-[0_10px_25px_rgba(0,229,255,0.4)] border border-[#00E5FF]'
                                        : isActive
                                            ? 'text-[#00E5FF] bg-white/10'
                                            : 'text-slate-400'
                                }`
                            }
                        >
                            {link.icon}
                            {!link.primary && (
                                <span className="text-[9px] font-bold tracking-tight">
                                    {link.label}
                                </span>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Main Floating Content Space */}
            <main className="relative z-10 flex-1 pt-24 pb-28 md:pb-16 px-4 sm:px-8 max-w-6xl mx-auto w-full">
                {children}
            </main>
        </div>
    );
};
