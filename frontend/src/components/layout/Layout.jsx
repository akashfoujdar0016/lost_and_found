import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Home, Search, PlusCircle, User, ShieldCheck, Shield,
    LogOut, Menu, X
} from 'lucide-react';

export const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();

    const studentLinks = [
        { to: '/student/dashboard', icon: <Home size={18} />, label: 'Dashboard' },
        { to: '/student/search', icon: <Search size={18} />, label: 'Search Registry' },
        { to: '/student/report', icon: <PlusCircle size={18} />, label: 'Report Item' },
        { to: '/student/activity', icon: <User size={18} />, label: 'My Submissions' },
        { to: '/student/profile', icon: <Shield size={18} />, label: 'Account Profile' },
    ];

    const facultyLinks = [
        { to: '/faculty/dashboard', icon: <Home size={18} />, label: 'Overview' },
        { to: '/faculty/verify', icon: <ShieldCheck size={18} />, label: 'Verify Queue' },
        { to: '/faculty/items-queue', icon: <User size={18} />, label: 'Items Queue' },
        { to: '/faculty/search', icon: <Search size={18} />, label: 'Search Registry' },
        { to: '/faculty/profile', icon: <Shield size={18} />, label: 'Account Profile' },
    ];

    const links = user.role === 'student' ? studentLinks : facultyLinks;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-[#090b0e] text-slate-100 bg-grid-pattern overflow-hidden relative">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex flex-col w-72 bg-[#11141b]/90 backdrop-blur-2xl border-r border-white/[0.08] z-50 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
                <div className="p-8 flex items-center gap-3.5 border-b border-white/[0.08]">
                    <div className="w-10 h-10 bg-[#161a24] border border-white/10 rounded-xl flex items-center justify-center text-sky-400 font-bold shadow-md">
                        <Shield size={20} />
                    </div>
                    <div>
                        <span className="block font-black text-sm tracking-wide text-white uppercase">GLA PORTAL</span>
                        <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-0.5">
                            {user?.role === 'faculty' ? 'Faculty Admin' : 'Student Access'}
                        </span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1.5 custom-scrollbar overflow-y-auto">
                    {links.map(link => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-wider ${isActive
                                    ? 'bg-sky-400 text-slate-950 shadow-[0_10px_25px_rgba(56,189,248,0.2)] font-extrabold translate-x-1'
                                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span className={isActive ? 'text-slate-950' : 'text-sky-400/80'}>{link.icon}</span>
                                    {link.label}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/[0.08] space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-[#161a23] rounded-xl border border-white/[0.06]">
                        <div className="w-9 h-9 rounded-lg bg-sky-400/10 border border-sky-400/20 flex items-center justify-center text-sky-400 font-bold text-xs shrink-0">
                            {user?.name?.charAt(0) || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs text-white truncate">{user?.name || 'User'}</h4>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest truncate">{user?.role || 'Guest'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2.5 px-4 py-2.5 w-full text-rose-400 text-xs font-bold uppercase tracking-wider hover:bg-rose-500/10 border border-rose-500/20 rounded-xl transition-all"
                    >
                        <LogOut size={16} /> Terminate Session
                    </button>
                </div>
            </aside>

            {/* Mobile Nav Top Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#090b0e]/90 backdrop-blur-xl border-b border-white/[0.08] px-6 flex items-center justify-between z-40">
                <div className="font-bold text-xs uppercase tracking-widest text-sky-400">GLA Lost & Found</div>
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-[#161a23] border border-white/10 rounded-xl text-white">
                    <Menu size={20} />
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-end" onClick={() => setIsSidebarOpen(false)}>
                    <div className="w-80 bg-[#11141b] border-l border-white/[0.08] h-full p-8 flex flex-col justify-between shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div>
                            <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/[0.08]">
                                <span className="font-bold text-xs uppercase tracking-widest text-slate-400">Navigation</span>
                                <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400 hover:text-white"><X size={20} /></button>
                            </div>
                            <nav className="space-y-2">
                                {links.map(link => (
                                    <NavLink
                                        key={link.to}
                                        to={link.to}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-wider ${isActive
                                                ? 'bg-sky-400 text-slate-950 shadow-md font-extrabold'
                                                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                                            }`
                                        }
                                    >
                                        {link.icon} {link.label}
                                    </NavLink>
                                ))}
                            </nav>
                        </div>
                        <div>
                            <button onClick={handleLogout} className="flex items-center justify-center gap-2.5 px-4 py-3 w-full text-rose-400 font-bold text-xs uppercase tracking-wider bg-rose-500/10 border border-rose-500/20 rounded-xl">
                                <LogOut size={16} /> Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto lg:pt-0 pt-16 flex flex-col relative custom-scrollbar z-10">
                {/* Header - Desktop Only */}
                <header className="hidden lg:flex h-20 px-12 items-center justify-between sticky top-0 bg-[#090b0e]/80 backdrop-blur-xl border-b border-white/[0.08] z-30">
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-wider text-white">
                            {links.find(l => window.location.pathname.includes(l.to))?.label || 'Dashboard Workspace'}
                        </h3>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-xs font-bold text-white">{user?.name || 'User'}</p>
                            <p className="text-[10px] font-semibold text-sky-400 uppercase tracking-widest">{user?.identifier || 'GLA ID'}</p>
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-[#161a24] border border-white/10 flex items-center justify-center text-sky-400 font-bold text-xs">
                            {user?.name?.charAt(0) || '?'}
                        </div>
                    </div>
                </header>

                <div className="flex-1 px-6 lg:px-12 py-10 max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
};
