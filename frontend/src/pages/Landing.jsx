import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getItems } from '../services/lostfound.service';

const getEmojiForCategory = (category) => {
    const emojiMap = {
        'electronics': '🎧',
        'accessories': '🎒',
        'keys': '🔑',
        'wallet': '👛',
        'phone': '📱',
        'laptop': '💻',
        'books': '📚',
        'clothing': '👕',
        'jewelry': '💍',
        'cards': '💳',
        'id-cards': '🪪',
        'bags': '🎒',
        'stationery': '✏️',
        'other': '📦'
    };
    return emojiMap[category?.toLowerCase()] || '📦';
};

const Landing = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [latestActivity, setLatestActivity] = useState([]);

    const getRelativeTime = (timestamp) => {
        if (!timestamp) return 'Just now';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);

        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    useEffect(() => {
        const fetchLatestActivity = async () => {
            try {
                const items = await getItems({ limit: 3 });
                const activityData = items.map(item => ({
                    id: item.id || item._id,
                    emoji: getEmojiForCategory(item.category),
                    title: item.title,
                    status: item.type === 'lost' ? 'Lost' : 'Found',
                    statusColor: item.type === 'lost' ? 'text-rose-400 border-rose-500/20 bg-rose-500/10' : 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10',
                    location: item.location,
                    timestamp: item.createdAt
                }));
                setLatestActivity(activityData);
            } catch (error) {
                console.error('Error fetching latest activity:', error);
            }
        };

        fetchLatestActivity();
    }, []);

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const navbarHeight = 90;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: elementPosition - navbarHeight,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-slate-100 bg-grid-pattern relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
            {/* Ambient Radial Background Glow */}
            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/[0.07] blur-[140px] rounded-full pointer-events-none z-0"></div>

            {/* Header / Anti-Gravity Navbar */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-5">
                <nav className="mx-auto max-w-7xl px-8 py-4 flex items-center justify-between bg-[#0c0f16]/70 backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-3 h-3 rounded-sm bg-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.8)]"></div>
                        <h1 className="text-sm font-black tracking-widest text-white uppercase font-sans">GLA UNIVERSITY</h1>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <button onClick={handleRegister} className="text-xs font-semibold text-slate-400 hover:text-white transition-colors uppercase tracking-wider">
                            Report Item
                        </button>
                        <button onClick={handleLogin} className="text-xs font-semibold text-slate-400 hover:text-white transition-colors uppercase tracking-wider">
                            Browse Found
                        </button>
                        <button onClick={() => scrollToSection('guidelines')} className="text-xs font-semibold text-slate-400 hover:text-white transition-colors uppercase tracking-wider">
                            Guidelines
                        </button>
                        <button
                            onClick={handleLogin}
                            className="px-6 py-2.5 rounded-xl bg-white/[0.06] border border-white/10 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 hover:border-white/20 transition-all shadow-[0_10px_25px_rgba(0,0,0,0.5)] active:scale-95 backdrop-blur-md"
                        >
                            Student Login
                        </button>
                    </div>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden px-3 py-2 rounded-xl bg-[#111318] border border-white/10 text-white"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </nav>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-3 bg-[#0c0f16]/95 border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl backdrop-blur-2xl">
                        <button onClick={() => { handleRegister(); setIsMobileMenuOpen(false); }} className="block w-full text-left text-xs uppercase tracking-wider text-slate-300 py-2">
                            Report Item
                        </button>
                        <button onClick={() => { handleLogin(); setIsMobileMenuOpen(false); }} className="block w-full text-left text-xs uppercase tracking-wider text-slate-300 py-2">
                            Browse Found
                        </button>
                        <button onClick={() => { scrollToSection('guidelines'); setIsMobileMenuOpen(false); }} className="block w-full text-left text-xs uppercase tracking-wider text-slate-300 py-2">
                            Guidelines
                        </button>
                        <button onClick={() => { handleLogin(); setIsMobileMenuOpen(false); }} className="w-full py-3 rounded-xl bg-cyan-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider text-center">
                            Student Login
                        </button>
                    </div>
                )}
            </header>

            {/* Main Anti-Gravity Workspace */}
            <main className="relative z-10 pt-32">
                {/* Hero Section */}
                <section className="mx-auto max-w-7xl px-6 py-20 min-h-[80vh] flex flex-col items-center justify-center text-center">
                    {/* Anti-Gravity Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,229,255,1)]"></span>
                        Official Campus Network
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.08] text-white tracking-tight max-w-4xl mb-6">
                        Campus <span className="text-cyan-400 drop-shadow-[0_0_35px_rgba(0,229,255,0.4)]">Lost &amp; Found.</span>
                    </h1>

                    {/* Hero Subheadline */}
                    <p className="text-slate-400 text-base md:text-lg max-w-2xl font-normal leading-relaxed mb-10">
                        A fast, secure, and effortless way to recover your misplaced items. Float a request to the campus network, or help a fellow student by reporting a found item.
                    </p>

                    {/* Hero Buttons */}
                    <div className="flex flex-wrap gap-5 justify-center mb-16">
                        <button
                            onClick={handleRegister}
                            className="px-9 py-4 rounded-xl bg-cyan-400 text-slate-950 font-extrabold text-xs uppercase tracking-widest hover:bg-cyan-300 transition-all shadow-[0_12px_35px_rgba(0,229,255,0.35)] hover:shadow-[0_20px_45px_rgba(0,229,255,0.45)] active:scale-95"
                        >
                            Report Lost Item
                        </button>
                        <button
                            onClick={handleLogin}
                            className="px-9 py-4 rounded-xl bg-[#11141b]/80 border border-white/15 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 hover:border-white/30 transition-all backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.5)] active:scale-95"
                        >
                            Search Database
                        </button>
                    </div>
                </section>

                {/* Anti-Gravity Live Activity Telemetry Card */}
                {latestActivity.length > 0 && (
                    <section className="mx-auto max-w-4xl px-6 mb-20">
                        <div className="rounded-3xl bg-[#0e1118]/80 border border-white/[0.08] p-6 md:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.95)] backdrop-blur-2xl transition-all hover:border-cyan-400/30">
                            <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.07]">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
                                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">Live Activity Stream</span>
                                </div>
                                <span className="text-[10px] font-extrabold text-cyan-400 bg-cyan-400/10 px-2.5 py-1 rounded border border-cyan-400/20 uppercase tracking-widest font-mono">Real-Time Sync</span>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                {latestActivity.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={handleLogin}
                                        className="p-4 rounded-2xl bg-[#151923] border border-white/[0.06] hover:border-cyan-400/40 transition-all shadow-lg hover:-translate-y-1 cursor-pointer group"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-2xl">{item.emoji}</span>
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${item.statusColor} font-mono uppercase`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">{item.title}</h4>
                                        <p className="text-[11px] text-slate-400 truncate mt-1">{item.location || 'GLA Campus Zone'}</p>
                                        <p className="text-[10px] text-slate-500 mt-2 font-mono text-right">{getRelativeTime(item.timestamp)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* Bottom Stats Row (3 Columns) */}
                <section className="mx-auto max-w-7xl px-6 mb-24">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Column 1 */}
                        <div className="rounded-3xl bg-[#0e1118]/80 border border-white/[0.08] p-9 shadow-[0_25px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl hover:border-cyan-400/30 hover:-translate-y-1.5 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl pointer-events-none"></div>
                            <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">100% Campus Verified</h3>
                            <p className="text-xs text-slate-400 font-medium">Monitored by GLA Administration</p>
                        </div>

                        {/* Column 2 */}
                        <div className="rounded-3xl bg-[#0e1118]/80 border border-white/[0.08] p-9 shadow-[0_25px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl hover:border-cyan-400/30 hover:-translate-y-1.5 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl pointer-events-none"></div>
                            <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">&lt; 24h Average Match</h3>
                            <p className="text-xs text-slate-400 font-medium">Fast recovery notifications</p>
                        </div>

                        {/* Column 3 */}
                        <div className="rounded-3xl bg-[#0e1118]/80 border border-white/[0.08] p-9 shadow-[0_25px_50px_rgba(0,0,0,0.7)] backdrop-blur-2xl hover:border-cyan-400/30 hover:-translate-y-1.5 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl pointer-events-none"></div>
                            <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">Secure &amp; Private</h3>
                            <p className="text-xs text-slate-400 font-medium">Your student details stay hidden</p>
                        </div>
                    </div>
                </section>

                {/* Guidelines Protocol Section */}
                <section id="guidelines" className="mx-auto max-w-7xl px-6 pb-24">
                    <div className="rounded-3xl bg-[#0e1118]/80 border border-white/[0.08] p-10 md:p-12 shadow-[0_35px_80px_rgba(0,0,0,0.9)] backdrop-blur-2xl text-center">
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded border border-cyan-400/20">Campus Guidelines</span>
                        <h3 className="text-3xl font-black text-white mt-4 mb-10">4-Step Recovery Protocol</h3>

                        <div className="grid md:grid-cols-4 gap-6 text-left">
                            <div className="p-6 rounded-2xl bg-[#151923] border border-white/[0.06]">
                                <span className="text-xs font-bold text-cyan-400 font-mono">PHASE 01</span>
                                <h4 className="text-sm font-bold text-white mt-2 mb-1">Student Authentication</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">Sign in with your GLA Student Roll No or Faculty ID.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-[#151923] border border-white/[0.06]">
                                <span className="text-xs font-bold text-cyan-400 font-mono">PHASE 02</span>
                                <h4 className="text-sm font-bold text-white mt-2 mb-1">Item Log</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">Create a detailed report with category, location, and optional media proof.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-[#151923] border border-white/[0.06]">
                                <span className="text-xs font-bold text-cyan-400 font-mono">PHASE 03</span>
                                <h4 className="text-sm font-bold text-white mt-2 mb-1">Faculty Verification</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">Faculty moderators audit claims and confirm ownership.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-[#151923] border border-white/[0.06]">
                                <span className="text-xs font-bold text-cyan-400 font-mono">PHASE 04</span>
                                <h4 className="text-sm font-bold text-white mt-2 mb-1">Safe Handover</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">Collect your item safely from the designated campus office desk.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/[0.07] bg-[#050505] py-12 relative z-10 font-sans">
                <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
                    <div>
                        <p className="text-white font-bold tracking-wider">GLA UNIVERSITY • LOST &amp; FOUND NETWORK</p>
                        <p className="mt-1 text-[11px] text-slate-400">Aetherium Anti-Gravity Spatial UX</p>
                    </div>
                    <div className="flex items-center gap-6 font-semibold uppercase tracking-wider">
                        <button onClick={handleLogin} className="text-cyan-400 hover:text-cyan-300">Student Login</button>
                        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-slate-400 hover:text-white">Back to Top</button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
