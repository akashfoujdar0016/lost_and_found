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
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [openFaq, setOpenFaq] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
                const items = await getItems({ limit: 6 });
                const activityData = items.map(item => ({
                    id: item.id || item._id,
                    emoji: getEmojiForCategory(item.category),
                    title: item.title,
                    category: item.category?.toLowerCase() || 'other',
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

    const handleLogin = () => navigate('/login');
    const handleRegister = () => navigate('/register');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        navigate(`/login`);
    };

    const categoriesList = [
        { id: 'id-cards', name: 'GLA ID Cards', emoji: '🪪', count: '140+ claims', desc: 'Roll number & library cards lost in AB blocks or canteens' },
        { id: 'electronics', name: 'Smartphones & Gear', emoji: '📱', count: '85+ claims', desc: 'AirPods, mobile phones, chargers & power banks' },
        { id: 'laptop', name: 'Laptops & Tech', emoji: '💻', count: '42+ claims', desc: 'MacBooks, Dell, HP laptops & technical equipment' },
        { id: 'keys', name: 'Hostel Keys & Fobs', emoji: '🔑', count: '90+ claims', desc: 'Hostel room keys, bike keys & security fobs' },
        { id: 'bags', name: 'Backpacks & Books', emoji: '🎒', count: '60+ claims', desc: 'College bags, lab manuals & study materials' },
        { id: 'wallet', name: 'Wallets & Documents', emoji: '👛', count: '55+ claims', desc: 'Wallets, government IDs, ATM cards & driving licenses' }
    ];

    const faqs = [
        {
            q: "How do I report a lost or found item at GLA University?",
            a: "Simply click 'Report Item' in the navbar or hero section. Authenticate using your GLA student or faculty account, specify whether the item was lost or found, add location details (e.g. AB1 Canteen, Academic Block 2, Library), upload a photo if available, and submit your report."
        },
        {
            q: "How does the identity & ownership verification process work?",
            a: "To prevent fraudulent claims, users must verify their identity using their GLA University Roll Number or official email. Before an item is handed over, the finder or campus security will ask for specific identification marks, serial numbers, or matching card details."
        },
        {
            q: "Where are physical found items stored on campus?",
            a: "Found items turned in by students are deposited at the Main Security Control Desk in Academic Block 1 or the Central Security Gate. You can track the exact handover location directly inside the item details view."
        },
        {
            q: "Are my personal contact details visible to everyone?",
            a: "No. Your phone number and email are kept completely private and masked. Communication and claim requests are processed through our secure, authenticated campus messaging system until verification is complete."
        },
        {
            q: "Is the GLA Lost & Found Network free to use?",
            a: "Yes! GLA Lost & Found Network is 100% free and built exclusively for all GLA University students, faculty, and administrative staff."
        }
    ];

    const filteredActivity = activeCategory === 'all'
        ? latestActivity
        : latestActivity.filter(item => item.category === activeCategory || (activeCategory === 'electronics' && ['phone', 'laptop', 'electronics'].includes(item.category)));

    return (
        <div className="min-h-screen bg-[#09090b] text-white relative overflow-x-hidden selection:bg-[#00E5FF]/20 selection:text-[#00E5FF] font-sans">
            {/* Full-Screen Film Grain Overlay */}
            <div className="film-grain-overlay"></div>

            {/* Ambient Deep Radial Lighting */}
            <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(1000px,100vw)] h-[min(1000px,100vw)] bg-[#0a1128]/70 blur-[220px] rounded-full pointer-events-none z-0"></div>
            <div className="fixed top-10 left-1/4 w-[min(500px,100vw)] h-[min(500px,100vw)] bg-[#00E5FF]/[0.03] blur-[180px] rounded-full pointer-events-none z-0"></div>
            <div className="fixed bottom-10 right-1/4 w-[min(600px,100vw)] h-[min(600px,100vw)] bg-[#00E5FF]/[0.02] blur-[200px] rounded-full pointer-events-none z-0"></div>

            {/* Improved Premium Floating Navbar */}
            <header className="fixed top-5 left-0 right-0 z-50 px-4 sm:px-6 flex justify-center">
                <nav className="px-5 sm:px-8 py-3.5 rounded-full true-glass flex items-center justify-between gap-6 max-w-5xl w-full border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                    {/* Brand Identifier */}
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="relative flex items-center justify-center">
                            <span className="w-3 h-3 rounded-full bg-[#00E5FF] shadow-[0_0_15px_#00E5FF]"></span>
                            <span className="absolute w-5 h-5 rounded-full bg-[#00E5FF]/30 animate-ping"></span>
                        </div>
                        <span className="font-extrabold text-sm tracking-[0.2em] text-white uppercase group-hover:text-[#00E5FF] transition-colors">
                            GLA <span className="text-[#00E5FF]">LOST &amp; FOUND</span>
                        </span>
                    </div>

                    {/* Nav Links (Desktop) */}
                    <div className="hidden lg:flex items-center gap-8 text-xs font-semibold tracking-wider uppercase">
                        <a href="#how-it-works" className="text-slate-400 hover:text-[#00E5FF] transition-colors">How It Works</a>
                        <a href="#telemetry-feed" className="text-slate-400 hover:text-[#00E5FF] transition-colors">Live Feed</a>
                        <a href="#categories" className="text-slate-400 hover:text-[#00E5FF] transition-colors">Categories</a>
                        <a href="#trust-security" className="text-slate-400 hover:text-[#00E5FF] transition-colors">Campus Security</a>
                        <a href="#faq" className="text-slate-400 hover:text-[#00E5FF] transition-colors">FAQ</a>
                    </div>

                    {/* Desktop Right CTA Action Group */}
                    <div className="hidden sm:flex items-center gap-3">
                        <button
                            onClick={handleRegister}
                            className="px-4 py-2 rounded-full text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                        >
                            Report Item
                        </button>

                        <button
                            onClick={handleLogin}
                            className="px-5 py-2.5 rounded-full magnetic-btn-primary text-xs font-bold uppercase tracking-wider cursor-pointer"
                        >
                            Sign In
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="sm:hidden p-2 rounded-full text-slate-300 hover:text-white focus:outline-none"
                        aria-label="Toggle Navigation Menu"
                    >
                        {mobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        )}
                    </button>
                </nav>
            </header>

            {/* Mobile Expandable Navigation Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-x-4 top-24 z-40 p-6 rounded-3xl true-glass border border-white/10 shadow-2xl flex flex-col gap-4 sm:hidden animate-in fade-in slide-in-from-top-4">
                    <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-300 py-2 border-b border-white/5">How It Works</a>
                    <a href="#telemetry-feed" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-300 py-2 border-b border-white/5">Recent Items Feed</a>
                    <a href="#categories" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-300 py-2 border-b border-white/5">Categories</a>
                    <a href="#trust-security" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-300 py-2 border-b border-white/5">Campus Security & Trust</a>
                    <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="text-sm font-semibold text-slate-300 py-2">Frequently Asked Questions</a>
                    
                    <div className="flex flex-col gap-3 pt-2">
                        <button onClick={handleRegister} className="w-full py-3 rounded-xl bg-white/10 text-white font-bold text-xs uppercase tracking-wider">
                            Report Lost or Found Item
                        </button>
                        <button onClick={handleLogin} className="w-full py-3 rounded-xl magnetic-btn-primary text-xs font-bold uppercase tracking-wider">
                            Sign In / Student Portal
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="relative z-10 pt-36 md:pt-44 pb-24 px-6 sm:px-12 max-w-7xl mx-auto space-y-32">
                
                {/* 1. HERO SECTION */}
                <section className="space-y-10 max-w-5xl">
                    {/* Official Campus Badge */}
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full true-glass drift-6 border border-white/10">
                        <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]"></span>
                        <span className="text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase">
                            GLA University Official Campus Recovery Platform
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-[clamp(2.75rem,7.5vw,6.5rem)] font-black leading-[1.02] tracking-[-0.04em] text-white">
                        Reclaim What's Yours. <br />
                        <span className="text-[#00E5FF] drop-shadow-[0_0_45px_rgba(0,229,255,0.4)]">Campus-Wide Recovery.</span>
                    </h1>

                    {/* Subtext */}
                    <p className="text-slate-400 text-lg sm:text-2xl font-normal leading-relaxed max-w-3xl tracking-tight">
                        The intelligent zero-gravity network linking students, faculty, and campus security for instant lost item matching, verified claims, and safe return.
                    </p>

                    {/* Hero Quick Search Bar */}
                    <form onSubmit={handleSearchSubmit} className="pt-2 max-w-2xl">
                        <div className="relative flex items-center true-glass rounded-2xl p-2 border border-white/15 focus-within:border-[#00E5FF]/50 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                            <svg className="w-5 h-5 text-slate-400 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search lost items (e.g. 'AirPods AB1', 'Roll No Card', 'Hostel Key')..."
                                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none px-4 py-2"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 rounded-xl magnetic-btn-primary text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer"
                            >
                                Search Claims
                            </button>
                        </div>
                    </form>

                    {/* Hero Action Buttons & Statistics Pill */}
                    <div className="flex flex-wrap gap-5 pt-4 items-center">
                        <button
                            onClick={handleRegister}
                            className="px-9 py-4 rounded-full magnetic-btn-primary text-xs uppercase tracking-widest cursor-pointer"
                        >
                            Report Lost Item
                        </button>

                        <button
                            onClick={handleLogin}
                            className="px-9 py-4 rounded-full true-glass text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-white/15"
                        >
                            Explore Claims Database
                        </button>

                        <div className="flex items-center gap-4 px-5 py-3 rounded-full true-glass border border-white/10 text-xs font-mono text-slate-400">
                            <span className="text-[#00E5FF] font-bold">98.4%</span> Recovery Match Rate
                        </div>
                    </div>
                </section>

                {/* 2. CAMPUS IMPACT STATS BAR */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    <div className="true-glass rounded-3xl p-6 border border-white/10 drift-6 space-y-2">
                        <div className="text-3xl sm:text-4xl font-black text-[#00E5FF] tracking-tight">2,840+</div>
                        <div className="text-xs font-mono uppercase tracking-wider text-slate-400">Items Processed</div>
                        <p className="text-[11px] text-slate-500">Tracked across all GLA blocks & departments</p>
                    </div>

                    <div className="true-glass rounded-3xl p-6 border border-white/10 drift-8 space-y-2">
                        <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">98.2%</div>
                        <div className="text-xs font-mono uppercase tracking-wider text-slate-400">Successful Return</div>
                        <p className="text-[11px] text-slate-500">Reunited with verified student owners</p>
                    </div>

                    <div className="true-glass rounded-3xl p-6 border border-white/10 drift-12 space-y-2">
                        <div className="text-3xl sm:text-4xl font-black text-[#00E5FF] tracking-tight">&lt; 12 Hours</div>
                        <div className="text-xs font-mono uppercase tracking-wider text-slate-400">Average Match Time</div>
                        <p className="text-[11px] text-slate-500">Instant AI pattern matching notifications</p>
                    </div>

                    <div className="true-glass rounded-3xl p-6 border border-white/10 drift-6 space-y-2">
                        <div className="text-3xl sm:text-4xl font-black text-purple-400 tracking-tight">100%</div>
                        <div className="text-xs font-mono uppercase tracking-wider text-slate-400">Verified Identity</div>
                        <p className="text-[11px] text-slate-500">Authenticated via official GLA Roll No.</p>
                    </div>
                </section>

                {/* 3. LIVE TELEMETRY FEED SECTION */}
                <section id="telemetry-feed" className="space-y-8 scroll-mt-32">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/[0.08]">
                        <div>
                            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#00E5FF] mb-2">
                                <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-ping"></span>
                                Live Item Feed
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Recently Reported Belongings</h2>
                        </div>

                        {/* Category Filter Pills */}
                        <div className="flex flex-wrap gap-2">
                            {['all', 'id-cards', 'electronics', 'keys', 'wallet'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all border ${
                                        activeCategory === cat
                                            ? 'bg-[#00E5FF] text-black font-bold border-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                                            : 'true-glass text-slate-400 hover:text-white border-white/10'
                                    }`}
                                >
                                    {cat === 'all' ? 'All Items' : cat.replace('-', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Activity Grid */}
                    {filteredActivity.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {filteredActivity.map((item, index) => {
                                const driftClass = index % 3 === 0 ? 'drift-6' : index % 3 === 1 ? 'drift-8' : 'drift-12';
                                return (
                                    <div
                                        key={item.id}
                                        onClick={handleLogin}
                                        className={`true-glass rounded-3xl p-6 cursor-pointer space-y-4 hover:border-[#00E5FF]/40 transition-all ${driftClass}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-4xl p-2 rounded-2xl bg-white/5 border border-white/10">{item.emoji}</span>
                                            <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full border ${item.statusColor}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="text-base font-bold text-white truncate">{item.title}</h4>
                                            <p className="text-xs text-slate-400 truncate mt-1 flex items-center gap-1.5">
                                                <svg className="w-3.5 h-3.5 text-[#00E5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                                {item.location || 'GLA Campus'}
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 pt-3 border-t border-white/[0.06]">
                                            <span>GLA Verified Report</span>
                                            <span className="text-slate-400">{getRelativeTime(item.timestamp)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="true-glass rounded-3xl p-12 text-center text-slate-400 space-y-3">
                            <div className="text-4xl">📦</div>
                            <p className="text-sm font-mono">No items found matching the selected category.</p>
                            <button onClick={handleLogin} className="px-6 py-2 rounded-full magnetic-btn-primary text-xs uppercase tracking-wider">
                                View Full Directory
                            </button>
                        </div>
                    )}
                </section>

                {/* 4. HOW IT WORKS SECTION */}
                <section id="how-it-works" className="space-y-12 scroll-mt-32">
                    <div className="text-center max-w-3xl mx-auto space-y-4">
                        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#00E5FF]">
                            3-Step Recovery Architecture
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">How GLA Lost &amp; Found Works</h2>
                        <p className="text-slate-400 text-base sm:text-lg">
                            Engineered for maximum security, speed, and privacy across all GLA academic blocks & hostels.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="true-glass rounded-3xl p-8 border border-white/10 space-y-5 relative group hover:border-[#00E5FF]/40 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] font-mono font-bold text-xl">
                                01
                            </div>
                            <h3 className="text-xl font-bold text-white">Broadcast Report</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Submit item details, last known campus location (e.g. AB1 Canteen, Central Library), estimated timestamp, and photo.
                            </p>
                            <ul className="text-xs text-slate-400 space-y-2 pt-2 border-t border-white/5 font-mono">
                                <li className="flex items-center gap-2">✓ Category & Location Tagging</li>
                                <li className="flex items-center gap-2">✓ Photo & Distinct Markings</li>
                            </ul>
                        </div>

                        {/* Step 2 */}
                        <div className="true-glass rounded-3xl p-8 border border-white/10 space-y-5 relative group hover:border-[#00E5FF]/40 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] font-mono font-bold text-xl">
                                02
                            </div>
                            <h3 className="text-xl font-bold text-white">Automated Matching</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Our intelligent indexing engine cross-references lost item parameters against newly reported items across campus in real time.
                            </p>
                            <ul className="text-xs text-slate-400 space-y-2 pt-2 border-t border-white/5 font-mono">
                                <li className="flex items-center gap-2">✓ Location & Time Synchronization</li>
                                <li className="flex items-center gap-2">✓ Instant In-App Notifications</li>
                            </ul>
                        </div>

                        {/* Step 3 */}
                        <div className="true-glass rounded-3xl p-8 border border-white/10 space-y-5 relative group hover:border-[#00E5FF]/40 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] font-mono font-bold text-xl">
                                03
                            </div>
                            <h3 className="text-xl font-bold text-white">Verified Campus Claim</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Verify roll number identity, present proof of ownership, and safely collect your item from security or finder handover points.
                            </p>
                            <ul className="text-xs text-slate-400 space-y-2 pt-2 border-t border-white/5 font-mono">
                                <li className="flex items-center gap-2">✓ Roll No. Authentication</li>
                                <li className="flex items-center gap-2">✓ Security Desk Handover</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 5. POPULAR CATEGORIES GRID SECTION */}
                <section id="categories" className="space-y-10 scroll-mt-32">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-white/[0.08]">
                        <div>
                            <div className="text-xs font-mono uppercase tracking-widest text-[#00E5FF] mb-2">
                                Campus Item Directory
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Browse Frequent Item Categories</h2>
                        </div>
                        <button onClick={handleLogin} className="text-xs font-mono text-[#00E5FF] hover:underline uppercase tracking-wider">
                            View All Categories &rarr;
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoriesList.map((cat) => (
                            <div
                                key={cat.id}
                                onClick={handleLogin}
                                className="true-glass rounded-3xl p-7 border border-white/10 cursor-pointer space-y-4 hover:border-[#00E5FF]/50 hover:scale-[1.02] transition-all group"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-4xl p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-[#00E5FF]/10 transition-colors">{cat.emoji}</span>
                                    <span className="text-[10px] font-mono text-[#00E5FF] bg-[#00E5FF]/10 px-3 py-1 rounded-full border border-[#00E5FF]/20">
                                        {cat.count}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white group-hover:text-[#00E5FF] transition-colors">{cat.name}</h3>
                                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{cat.desc}</p>
                                </div>
                                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 pt-2 border-t border-white/5">
                                    <span>Browse Category</span>
                                    <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 6. CAMPUS TRUST & SECURITY PROTOCOL */}
                <section id="trust-security" className="true-glass rounded-3xl p-8 sm:p-14 border border-white/15 relative overflow-hidden space-y-10 scroll-mt-32">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E5FF]/10 blur-[150px] pointer-events-none"></div>

                    <div className="max-w-3xl space-y-4">
                        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#00E5FF]">
                            🛡️ Campus Safety Framework
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                            Built Specifically for GLA University Security & Trust
                        </h2>
                        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                            We eliminate false claims, lost property theft, and privacy leaks by enforcing authenticated GLA credentials and faculty-supervised queue moderation.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
                        <div className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                            <div className="text-2xl">🪪</div>
                            <h4 className="text-base font-bold text-white">Roll Number Authentication</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Every student and faculty member signs in with verified GLA University credentials. Unauthenticated external accounts are blocked.
                            </p>
                        </div>

                        <div className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                            <div className="text-2xl">🔒</div>
                            <h4 className="text-base font-bold text-white">Masked Contact Protection</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Personal phone numbers and emails are hidden behind encrypted aliases until claim verification is officially approved.
                            </p>
                        </div>

                        <div className="space-y-3 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                            <div className="text-2xl">🏫</div>
                            <h4 className="text-base font-bold text-white">Central Security Desks</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Physical belongings can be securely dropped off at AB1 Security Desk or Central Gate for official verification and pickup.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 7. FREQUENTLY ASKED QUESTIONS (FAQ) */}
                <section id="faq" className="space-y-10 scroll-mt-32 max-w-4xl mx-auto">
                    <div className="text-center space-y-3">
                        <div className="text-xs font-mono uppercase tracking-widest text-[#00E5FF]">
                            Got Questions?
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Frequently Asked Questions</h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="true-glass rounded-2xl border border-white/10 overflow-hidden transition-all"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full p-6 text-left flex justify-between items-center gap-4 text-sm sm:text-base font-bold text-white hover:text-[#00E5FF] transition-colors"
                                >
                                    <span>{faq.q}</span>
                                    <span className="text-[#00E5FF] text-xl font-mono">{openFaq === idx ? '−' : '+'}</span>
                                </button>
                                {openFaq === idx && (
                                    <div className="px-6 pb-6 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-4">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* 8. HIGH-IMPACT CALL TO ACTION BANNER */}
                <section className="true-glass rounded-3xl p-10 sm:p-16 border border-[#00E5FF]/30 text-center space-y-8 relative overflow-hidden shadow-[0_0_80px_rgba(0,229,255,0.15)]">
                    <div className="max-w-2xl mx-auto space-y-4">
                        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                            Lost Something on Campus Today?
                        </h2>
                        <p className="text-slate-300 text-base sm:text-lg">
                            Join thousands of GLA University students using our instant recovery network. Report your item in under 60 seconds.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 pt-2">
                        <button
                            onClick={handleRegister}
                            className="px-9 py-4 rounded-full magnetic-btn-primary text-xs uppercase tracking-widest cursor-pointer"
                        >
                            Report Lost Item Now
                        </button>

                        <button
                            onClick={handleLogin}
                            className="px-9 py-4 rounded-full true-glass text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-white/20"
                        >
                            Sign In to Student Portal
                        </button>
                    </div>
                </section>

            </main>

            {/* Mobile Bottom Fixed Tab Bar */}
            <div className="md:hidden fixed bottom-5 left-4 right-4 z-50">
                <nav className="px-6 py-3.5 rounded-full true-glass flex items-center justify-around border border-white/15 shadow-2xl">
                    <button onClick={handleRegister} className="text-xs font-extrabold text-[#00E5FF] uppercase tracking-wider flex items-center gap-1">
                        <span>➕</span> Report
                    </button>
                    <button onClick={handleLogin} className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                        <span>🔍</span> Search
                    </button>
                    <button onClick={handleLogin} className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1">
                        <span>🔑</span> Sign In
                    </button>
                </nav>
            </div>

            {/* Editorial Footer */}
            <footer className="relative z-10 border-t border-white/[0.08] py-12 px-6 sm:px-12 font-mono text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-6 max-w-7xl mx-auto">
                <div className="space-y-2 text-center md:text-left">
                    <div className="text-white font-bold text-sm tracking-wider">GLA UNIVERSITY LOST &amp; FOUND</div>
                    <div className="text-slate-500 text-[11px]">Official Student &amp; Campus Recovery Network • Mathura, UP</div>
                </div>

                <div className="flex flex-wrap justify-center gap-6 text-[11px] text-slate-400">
                    <a href="#how-it-works" className="hover:text-[#00E5FF] transition-colors">How It Works</a>
                    <a href="#telemetry-feed" className="hover:text-[#00E5FF] transition-colors">Live Feed</a>
                    <a href="#categories" className="hover:text-[#00E5FF] transition-colors">Categories</a>
                    <a href="#trust-security" className="hover:text-[#00E5FF] transition-colors">Security Protocol</a>
                    <a href="#faq" className="hover:text-[#00E5FF] transition-colors">FAQ</a>
                </div>

                <div className="text-slate-500 text-[11px]">
                    &copy; {new Date().getFullYear()} GLA University. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Landing;
