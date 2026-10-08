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
                    statusColor: item.type === 'lost' ? 'text-rose-400 border-rose-500/20 bg-rose-500/10' : 'text-[#00E5FF] border-[#00E5FF]/20 bg-[#00E5FF]/10',
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

    return (
        <div className="min-h-screen bg-[#09090b] text-white relative overflow-x-hidden selection:bg-[#00E5FF]/20 selection:text-[#00E5FF] font-sans">
            {/* Fixed Full-Screen Film Grain Overlay */}
            <div className="film-grain-overlay"></div>

            {/* Deep Ambient Radial Glow Backdrop */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(900px,100vw)] h-[min(900px,100vw)] bg-[#0a1128]/70 blur-[200px] rounded-full pointer-events-none z-0"></div>
            <div className="fixed top-0 left-1/4 w-[min(500px,100vw)] h-[min(500px,100vw)] bg-[#00E5FF]/[0.02] blur-[170px] rounded-full pointer-events-none z-0"></div>

            {/* Desktop Minimalist Floating Frosted Pill Navbar */}
            <header className="fixed top-6 left-0 right-0 z-50 px-4 flex justify-center">
                <nav className="px-8 py-3.5 rounded-full true-glass flex items-center justify-between gap-10 max-w-2xl w-full">
                    {/* Brand Identifier */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] shadow-[0_0_12px_#00E5FF]"></div>
                        <span className="font-extrabold text-xs tracking-[0.2em] text-white uppercase">
                            GLA <span className="text-[#00E5FF]">NETWORK</span>
                        </span>
                    </div>

                    {/* Nav Links (Desktop) */}
                    <div className="hidden md:flex items-center gap-6">
                        <button onClick={handleRegister} className="text-xs font-medium text-slate-400 hover:text-white transition-colors">
                            Report
                        </button>
                        <button onClick={handleLogin} className="text-xs font-medium text-slate-400 hover:text-white transition-colors">
                            Browse
                        </button>
                        <button onClick={handleLogin} className="text-xs font-medium text-slate-400 hover:text-white transition-colors">
                            Sign In
                        </button>
                    </div>

                    <button
                        onClick={handleLogin}
                        className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs transition-all duration-300"
                    >
                        Student Access
                    </button>
                </nav>
            </header>

            {/* Main Editorial Hero Section */}
            <main className="relative z-10 pt-36 md:pt-44 pb-28 px-6 sm:px-12 max-w-7xl mx-auto min-h-screen flex flex-col justify-between">
                {/* Hero Core Copy & Actions */}
                <div className="space-y-10 max-w-5xl my-auto">
                    {/* Editorial Badge */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full true-glass drift-6">
                        <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]"></span>
                        <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
                            Official Campus Network
                        </span>
                    </div>

                    {/* Massive Dramatic Headline */}
                    <h1 className="text-[clamp(3rem,8vw,7rem)] font-black leading-[0.98] tracking-[-0.05em] text-white">
                        GLA <span className="text-[#00E5FF] drop-shadow-[0_0_40px_rgba(0,229,255,0.35)]">Lost &amp; Found.</span>
                    </h1>

                    {/* Editorial Subtext */}
                    <p className="text-slate-400 text-lg sm:text-2xl font-normal leading-relaxed max-w-2xl tracking-tight">
                        Reclaim your lost items. Effortless, secure, campus-wide recovery.
                    </p>

                    {/* Magnetic Action Buttons */}
                    <div className="flex flex-wrap gap-5 pt-4 items-center">
                        <button
                            onClick={handleRegister}
                            className="px-9 py-4 rounded-full magnetic-btn-primary text-xs uppercase tracking-widest cursor-pointer"
                        >
                            Report an Item
                        </button>

                        <button
                            onClick={handleLogin}
                            className="px-9 py-4 rounded-full true-glass text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all duration-300"
                        >
                            Search Network
                        </button>
                    </div>
                </div>

                {/* Asymmetrical Levitating Telemetry Stream */}
                {latestActivity.length > 0 && (
                    <div className="pt-20">
                        <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/[0.06]">
                            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                                Real-Time Telemetry Feed
                            </span>
                            <span className="text-[10px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-2.5 py-0.5 rounded-full border border-[#00E5FF]/20">
                                Live Sync
                            </span>
                        </div>

                        {/* Asymmetrical Broken Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {latestActivity.map((item, index) => {
                                const driftClass = index % 3 === 0 ? 'drift-6' : index % 3 === 1 ? 'drift-8' : 'drift-12';
                                return (
                                    <div
                                        key={item.id}
                                        onClick={handleLogin}
                                        className={`true-glass rounded-3xl p-6 cursor-pointer space-y-3 ${driftClass}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-3xl">{item.emoji}</span>
                                            <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${item.statusColor}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                                            <p className="text-xs text-slate-400 truncate mt-1">{item.location || 'GLA Campus'}</p>
                                        </div>
                                        <div className="text-right text-[10px] font-mono text-slate-500 pt-2 border-t border-white/[0.04]">
                                            {getRelativeTime(item.timestamp)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>

            {/* Floating Mobile Bottom Tab Bar */}
            <div className="md:hidden fixed bottom-6 left-4 right-4 z-50">
                <nav className="px-6 py-3 rounded-full true-glass flex items-center justify-around">
                    <button onClick={handleRegister} className="text-xs font-extrabold text-[#00E5FF] uppercase tracking-wider">
                        Report
                    </button>
                    <button onClick={handleLogin} className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Search
                    </button>
                    <button onClick={handleLogin} className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Sign In
                    </button>
                </nav>
            </div>

            {/* Minimal Editorial Footer */}
            <footer className="relative z-10 border-t border-white/[0.06] py-10 px-6 sm:px-12 font-mono text-xs text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>&copy; GLA UNIVERSITY LOST &amp; FOUND</div>
            </footer>
        </div>
    );
};

export default Landing;
