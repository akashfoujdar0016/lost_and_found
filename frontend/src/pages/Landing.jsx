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
                    id: item.id,
                    emoji: getEmojiForCategory(item.category),
                    title: item.title,
                    status: item.type === 'lost' ? 'Lost' : 'Found',
                    statusColor: item.type === 'lost' ? 'text-rose-400 border-rose-500/20 bg-rose-500/10' : 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10',
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

    const handleGetStarted = () => {
        navigate('/login');
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
        <div className="min-h-screen bg-[#090b0e] text-slate-100 bg-grid-pattern relative overflow-x-hidden">
            {/* Header / Navigation Bar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#090b0e]/80 backdrop-blur-2xl border-b border-white/[0.08]">
                <nav className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#14171f] border border-white/10 flex items-center justify-center font-bold text-sky-400 shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
                            LF
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-white tracking-wide">GLA UNIVERSITY</h1>
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Lost & Found Portal</p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <button onClick={() => scrollToSection('about')} className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors">
                            About
                        </button>
                        <button onClick={() => scrollToSection('features')} className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors">
                            Features
                        </button>
                        <button onClick={() => scrollToSection('how-it-works')} className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors">
                            Process
                        </button>
                        <button
                            onClick={handleGetStarted}
                            className="px-5 py-2.5 rounded-xl bg-sky-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider hover:bg-sky-300 transition-all shadow-[0_10px_30px_rgba(56,189,248,0.2)] active:scale-95"
                        >
                            Portal Access
                        </button>
                    </div>

                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden px-3 py-2 rounded-xl bg-[#14171f] border border-white/10 text-white"
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

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-[#0e1117] border-b border-white/10 py-4 px-6 space-y-3">
                        <button onClick={() => { scrollToSection('about'); setIsMobileMenuOpen(false); }} className="block w-full text-left text-xs uppercase tracking-wider text-slate-300 py-2">
                            About
                        </button>
                        <button onClick={() => { scrollToSection('features'); setIsMobileMenuOpen(false); }} className="block w-full text-left text-xs uppercase tracking-wider text-slate-300 py-2">
                            Features
                        </button>
                        <button onClick={() => { scrollToSection('how-it-works'); setIsMobileMenuOpen(false); }} className="block w-full text-left text-xs uppercase tracking-wider text-slate-300 py-2">
                            Process
                        </button>
                        <button onClick={() => { handleGetStarted(); setIsMobileMenuOpen(false); }} className="w-full py-3 rounded-xl bg-sky-400 text-slate-950 font-bold text-xs uppercase tracking-wider text-center">
                            Portal Access
                        </button>
                    </div>
                )}
            </header>

            <main className="relative z-10 pt-28">
                {/* Hero Section */}
                <section className="mx-auto max-w-7xl px-6 py-20 min-h-[85vh] flex items-center grid lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-7 space-y-8">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-white/[0.04] border border-white/10 text-slate-300 text-[11px] font-semibold tracking-wider uppercase">
                            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                            Official University Infrastructure
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] text-white tracking-tight">
                            Corporate <span className="text-sky-400">Anti-Gravity</span> Campus Portal.
                        </h1>
                        <p className="text-slate-400 text-base md:text-lg max-w-2xl font-normal leading-relaxed">
                            A weightless, centralized recovery ecosystem for GLA University. Seamlessly report lost items, verify owner claims, and execute authenticated returns with complete administrative audit trails.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-2">
                            <button
                                onClick={handleGetStarted}
                                className="px-8 py-4 rounded-xl bg-sky-400 text-slate-950 font-extrabold text-xs uppercase tracking-widest hover:bg-sky-300 transition-all shadow-[0_20px_40px_rgba(56,189,248,0.25)] hover:shadow-[0_25px_50px_rgba(56,189,248,0.35)] active:scale-95"
                            >
                                Launch Dashboard
                            </button>
                            <button
                                onClick={() => scrollToSection('features')}
                                className="px-8 py-4 rounded-xl bg-white/[0.04] border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/[0.08] hover:border-white/20 transition-all"
                            >
                                System Architecture
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/[0.08]">
                            <div>
                                <p className="text-2xl font-extrabold text-white">100%</p>
                                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Faculty Moderated</p>
                            </div>
                            <div>
                                <p className="text-2xl font-extrabold text-white">&lt; 24h</p>
                                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Average Match</p>
                            </div>
                            <div>
                                <p className="text-2xl font-extrabold text-white">256-Bit</p>
                                <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold">JWT Verified</p>
                            </div>
                        </div>
                    </div>

                    {/* Anti-Gravity Floating 3D Cards */}
                    <div className="lg:col-span-5 relative">
                        <div className="relative z-20 rounded-2xl bg-[#11141b]/90 border border-white/10 p-6 shadow-[0_30px_70px_rgba(0,0,0,0.85)] backdrop-blur-xl transform hover:-translate-y-2 transition-all duration-500">
                            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest ml-2">Live Activity Stream</span>
                                </div>
                                <span className="text-[10px] font-bold text-sky-400 bg-sky-400/10 px-2 py-0.5 rounded border border-sky-400/20 uppercase tracking-widest">Active Sync</span>
                            </div>

                            <div className="space-y-3">
                                {latestActivity.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4 p-3.5 rounded-xl bg-[#161a24] border border-white/[0.06] hover:border-sky-400/30 transition-all shadow-md group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-[#1e2330] border border-white/10 flex items-center justify-center text-lg shrink-0">
                                            {item.emoji}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-bold text-white truncate group-hover:text-sky-300 transition-colors">{item.title}</h4>
                                            <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.location || 'GLA Campus'}</p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${item.statusColor}`}>
                                                {item.status}
                                            </span>
                                            <p className="text-[10px] text-slate-500 mt-1">{getRelativeTime(item.timestamp)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Overlapping Floating Background Layer Card */}
                        <div className="absolute -bottom-6 -right-6 w-full h-full rounded-2xl bg-[#0f1218]/80 border border-white/[0.05] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-md z-10 pointer-events-none transform translate-x-4 translate-y-4"></div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="mx-auto max-w-7xl px-6 py-20">
                    <div className="rounded-3xl bg-[#11141b]/80 border border-white/[0.08] p-10 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <span className="text-[11px] font-extrabold uppercase tracking-widest text-sky-400 bg-sky-400/10 px-3 py-1 rounded border border-sky-400/20">Institutional Mandate</span>
                                <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                                    Enterprise Precision for Campus Recovery
                                </h2>
                                <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                                    GLA Lost & Found standardizes how personal belongings are reported, authenticated, and reclaimed across university grounds. Every claim passes through encrypted verification protocols supervised by administrative faculty.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-6 rounded-2xl bg-[#161a23] border border-white/[0.06] hover:border-sky-400/30 transition-all">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">01. Smart Logging</h4>
                                    <p className="text-slate-400 text-xs leading-relaxed">Structured cataloging with categorical taxonomy and location metadata.</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-[#161a23] border border-white/[0.06] hover:border-sky-400/30 transition-all">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">02. Ownership Verification</h4>
                                    <p className="text-slate-400 text-xs leading-relaxed">Multi-factor claim authorization handled directly by department heads.</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-[#161a23] border border-white/[0.06] hover:border-sky-400/30 transition-all">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">03. Automated Match</h4>
                                    <p className="text-slate-400 text-xs leading-relaxed">Algorithmic correlation connecting lost reports with found submissions.</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-[#161a23] border border-white/[0.06] hover:border-sky-400/30 transition-all">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2">04. Audit Log</h4>
                                    <p className="text-slate-400 text-xs leading-relaxed">Transparent status tracking from reporting to final handover.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="mx-auto max-w-7xl px-6 py-20">
                    <div className="text-center mb-16 space-y-3">
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-sky-400 bg-sky-400/10 px-3 py-1 rounded border border-sky-400/20">Core System Capabilities</span>
                        <h3 className="text-3xl md:text-5xl font-black text-white">System Architecture</h3>
                        <p className="text-slate-400 text-sm max-w-xl mx-auto">Engineered for speed, clarity, and security across desktop and mobile clients.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="rounded-2xl bg-[#11141b]/80 border border-white/[0.08] p-8 shadow-[0_25px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl hover:-translate-y-2 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center text-sky-400 mb-6 font-bold text-xl">
                                01
                            </div>
                            <h4 className="text-lg font-bold text-white mb-3">Structured Search & Filters</h4>
                            <p className="text-slate-400 text-xs leading-relaxed">Instant indexing across categories, timestamps, locations, and status states for high precision item lookup.</p>
                        </div>

                        <div className="rounded-2xl bg-[#11141b]/80 border border-white/[0.08] p-8 shadow-[0_25px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl hover:-translate-y-2 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center text-sky-400 mb-6 font-bold text-xl">
                                02
                            </div>
                            <h4 className="text-lg font-bold text-white mb-3">Faculty Verification Queue</h4>
                            <p className="text-slate-400 text-xs leading-relaxed">Dedicated administrative review queues ensuring claims are validated prior to item handover.</p>
                        </div>

                        <div className="rounded-2xl bg-[#11141b]/80 border border-white/[0.08] p-8 shadow-[0_25px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl hover:-translate-y-2 transition-all duration-300">
                            <div className="w-12 h-12 rounded-xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center text-sky-400 mb-6 font-bold text-xl">
                                03
                            </div>
                            <h4 className="text-lg font-bold text-white mb-3">Cloud Storage Integration</h4>
                            <p className="text-slate-400 text-xs leading-relaxed">Direct media upload pipelines allowing visual proof submission for items and verification documents.</p>
                        </div>
                    </div>
                </section>

                {/* Process Section */}
                <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-20">
                    <div className="rounded-3xl bg-[#11141b]/80 border border-white/[0.08] p-10 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl text-center">
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-sky-400 bg-sky-400/10 px-3 py-1 rounded border border-sky-400/20">Operational Workflow</span>
                        <h3 className="text-3xl font-black text-white mt-4 mb-10">4-Step Recovery Protocol</h3>

                        <div className="grid md:grid-cols-4 gap-6 text-left">
                            <div className="p-6 rounded-2xl bg-[#161a23] border border-white/[0.06]">
                                <span className="text-xs font-bold text-sky-400">PHASE 01</span>
                                <h4 className="text-sm font-bold text-white mt-2 mb-2">Authentication</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">Sign in with university credentials (Student Roll No or Faculty ID).</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-[#161a23] border border-white/[0.06]">
                                <span className="text-xs font-bold text-sky-400">PHASE 02</span>
                                <h4 className="text-sm font-bold text-white mt-2 mb-2">Item Log</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">Create a detailed report with category, location, and optional media proof.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-[#161a23] border border-white/[0.06]">
                                <span className="text-xs font-bold text-sky-400">PHASE 03</span>
                                <h4 className="text-sm font-bold text-white mt-2 mb-2">Faculty Audit</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">Faculty moderators verify item claims and validate ownership.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-[#161a23] border border-white/[0.06]">
                                <span className="text-xs font-bold text-sky-400">PHASE 04</span>
                                <h4 className="text-sm font-bold text-white mt-2 mb-2">Handover</h4>
                                <p className="text-slate-400 text-xs leading-relaxed">Collect approved items from the designated campus administrative desk.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/[0.08] bg-[#090b0e] py-12 relative z-10">
                <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
                    <div>
                        <p className="text-white font-bold tracking-wider">GLA UNIVERSITY • LOST & FOUND</p>
                        <p className="mt-1">Corporate Anti-Gravity UI Architecture</p>
                    </div>
                    <div className="flex items-center gap-6 font-semibold uppercase tracking-wider">
                        <button onClick={handleGetStarted} className="text-sky-400 hover:text-sky-300">Sign In</button>
                        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-slate-400 hover:text-white">Back to Top</button>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
