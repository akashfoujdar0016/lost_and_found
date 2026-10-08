import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { getItems } from '../../services/lostfound.service';
import { getMatchRecommendations } from '../../services/matching.service';
import { FileText, Zap, ArrowUpRight, Plus, CheckCircle2, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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

const StudentDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const [recentItems, setRecentItems] = useState([]);
    const [myReports, setMyReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categoryBreakdown, setCategoryBreakdown] = useState([]);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                // Fetch active items
                const allItems = await getItems({ status: 'active', limit: 50 });

                // User's own submissions
                const userReports = allItems.filter(item => {
                    const reporterId = item.reportedBy?._id || item.reportedBy;
                    return reporterId === user?.id;
                });

                // Other students' recent listings
                const othersItems = allItems.filter(item => {
                    const reporterId = item.reportedBy?._id || item.reportedBy;
                    return reporterId !== user?.id;
                }).slice(0, 5);

                setMyReports(userReports);
                setRecentItems(othersItems);

                // Auto-match algorithm recommendations
                const recommendations = await getMatchRecommendations(2);
                setMatches(recommendations);

                // Calculate category distribution percentage
                const catCounts = {};
                allItems.forEach(i => {
                    const cat = i.category || 'Other';
                    catCounts[cat] = (catCounts[cat] || 0) + 1;
                });

                const total = allItems.length || 1;
                const breakdown = Object.entries(catCounts).map(([cat, count]) => ({
                    name: cat.charAt(0).toUpperCase() + cat.slice(1),
                    count,
                    percentage: Math.round((count / total) * 100)
                })).sort((a, b) => b.count - a.count).slice(0, 4);

                setCategoryBreakdown(breakdown);
            } catch (err) {
                console.error('Error loading anti-gravity dashboard data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        if (user?.id) {
            loadDashboard();
        }
    }, [user?.id]);

    const getRelativeTime = (timestamp) => {
        if (!timestamp) return 'Recently';
        const date = new Date(timestamp);
        const diff = Math.floor((new Date() - date) / 1000);
        if (diff < 60) return 'Just now';
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    return (
        <Layout>
            <div className="space-y-[clamp(1.5rem,4vw,3rem)] animate-fade-in">
                {/* Hero Greeting & Floating Primary Action */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] text-xs font-semibold text-slate-300">
                            <span className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF] animate-pulse"></span>
                            <span>System Online • Student Portal</span>
                        </div>
                        <h1 className="text-[clamp(1.75rem,5vw,2.5rem)] font-black text-white tracking-tight leading-tight">
                            Welcome back, <span className="text-[#00E5FF]">{user?.name?.split(' ')[0] || 'Student'}</span>
                        </h1>
                        <p className="text-slate-400 text-xs sm:text-sm font-medium max-w-xl">
                            Track your active items, review administrative verification matches, or float a new lost report to the campus network.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/student/report')}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#00E5FF] text-slate-950 font-extrabold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_15px_35px_rgba(0,229,255,0.35)] hover:shadow-[0_25px_50px_rgba(0,229,255,0.5)] active:scale-95 shrink-0"
                    >
                        <Plus size={16} strokeWidth={3} />
                        <span>Report Misplaced Item</span>
                    </button>
                </div>

                {/* Levitating Auto-Match Banner (If match found) */}
                {matches.length > 0 && (
                    <div className="anti-gravity-card rounded-3xl p-[clamp(1.25rem,3vw,2rem)] flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] shrink-0">
                                <Zap size={22} className="animate-bounce" />
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00E5FF]">
                                    AI Match Detected
                                </span>
                                <h3 className="text-base sm:text-lg font-bold text-white">
                                    Potential match found for "{matches[0].lostItem?.title}"
                                </h3>
                                <p className="text-xs text-slate-400 font-medium">
                                    A found item matching your report was logged in <span className="text-white font-semibold">{matches[0].foundItem?.location || 'GLA Campus'}</span>.
                                </p>
                            </div>
                        </div>

                        <Link
                            to={`/student/items/${matches[0].foundItem?.id}`}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 shrink-0"
                        >
                            <span>Inspect Match</span>
                            <ArrowUpRight size={14} />
                        </Link>
                    </div>
                )}

                {/* Minimalist Data Visualizers (Weightless Stat Row) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Stat Card 1 */}
                    <div className="anti-gravity-card rounded-3xl p-[clamp(1.25rem,3vw,1.75rem)]">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-semibold text-slate-400 tracking-wider">My Submissions</span>
                            <div className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]"></div>
                        </div>
                        <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
                            {myReports.length}
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-[#00E5FF] h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_#00E5FF]"
                                style={{ width: `${Math.min(myReports.length * 25, 100)}%` }}
                            ></div>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium mt-3">Items reported by your account</p>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="anti-gravity-card rounded-3xl p-[clamp(1.25rem,3vw,1.75rem)]">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-semibold text-slate-400 tracking-wider">Campus Items</span>
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">Synced</span>
                        </div>
                        <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
                            {recentItems.length + myReports.length}
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-400 h-full rounded-full w-4/5 shadow-[0_0_10px_#10b981]"></div>
                        </div>
                        <p className="text-[11px] text-slate-400 font-medium mt-3">Active database entries</p>
                    </div>
                </div>

                {/* Main Content Layout: Floating Reports List & Telemetry Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: My Submissions & Recent Feed */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Section: My Submissions */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">My Active Submissions</h2>
                                    <p className="text-xs text-slate-400">Items you logged onto the university network</p>
                                </div>
                                <Link
                                    to="/student/report"
                                    className="text-xs font-bold text-[#00E5FF] hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
                                >
                                    <span>New Report</span>
                                    <ArrowUpRight size={14} />
                                </Link>
                            </div>

                            {isLoading ? (
                                <div className="space-y-3">
                                    {[1, 2].map(i => (
                                        <div key={i} className="h-20 rounded-2xl bg-white/[0.03] border border-white/[0.05] animate-pulse"></div>
                                    ))}
                                </div>
                            ) : myReports.length === 0 ? (
                                <div className="anti-gravity-card rounded-3xl p-8 text-center space-y-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 mx-auto">
                                        <FileText size={22} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-bold text-white">No active submissions yet</h4>
                                        <p className="text-xs text-slate-400">Log a lost or found item to trigger automatic matching.</p>
                                    </div>
                                    <Link
                                        to="/student/report"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#00E5FF] text-slate-950 font-extrabold text-xs uppercase tracking-wider"
                                    >
                                        Create First Submission
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {myReports.map(item => (
                                        <div
                                            key={item.id || item._id}
                                            className="anti-gravity-card rounded-2xl p-4 flex items-center justify-between gap-4 group"
                                        >
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                                                    {getEmojiForCategory(item.category)}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-[#00E5FF] transition-colors">
                                                        {item.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                                                        <span className="capitalize">{item.category}</span>
                                                        <span>•</span>
                                                        <span className="truncate">{item.location || 'GLA Campus'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right shrink-0">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                                                    item.type === 'lost'
                                                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                                                        : 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-[#00E5FF]'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${item.type === 'lost' ? 'bg-rose-400' : 'bg-[#00E5FF]'}`}></span>
                                                    {item.type}
                                                </span>
                                                <p className="text-[10px] font-mono text-slate-500 mt-1.5">{getRelativeTime(item.createdAt)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Section: Campus Activity Stream */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">Campus Activity Stream</h2>
                                    <p className="text-xs text-slate-400">Recent misplaced items reported across GLA campus</p>
                                </div>
                                <Link
                                    to="/student/search"
                                    className="text-xs font-bold text-[#00E5FF] hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
                                >
                                    <span>Browse All</span>
                                    <ArrowUpRight size={14} />
                                </Link>
                            </div>

                            <div className="space-y-3">
                                {isLoading ? (
                                    [1, 2, 3].map(i => (
                                        <div key={i} className="h-20 rounded-2xl bg-white/[0.03] border border-white/[0.05] animate-pulse"></div>
                                    ))
                                ) : recentItems.length === 0 ? (
                                    <p className="text-xs text-slate-500 py-4">No recent activity logged.</p>
                                ) : (
                                    recentItems.map(item => (
                                        <div
                                            key={item.id || item._id}
                                            onClick={() => navigate('/student/search')}
                                            className="anti-gravity-card rounded-2xl p-4 flex items-center justify-between gap-4 cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-4 min-w-0">
                                                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                                                    {getEmojiForCategory(item.category)}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-[#00E5FF] transition-colors">
                                                        {item.title}
                                                    </h4>
                                                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                                        {item.location || 'GLA Campus'} • By {item.reportedBy?.name || 'Student'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right shrink-0">
                                                <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/5 text-slate-300 border border-white/10 font-mono">
                                                    {item.type}
                                                </span>
                                                <p className="text-[10px] font-mono text-slate-500 mt-1">{getRelativeTime(item.createdAt)}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sleek Data Insights Track */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="anti-gravity-card rounded-3xl p-[clamp(1.25rem,3vw,1.75rem)] space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                                <h3 className="text-xs font-bold text-white tracking-wide uppercase">Category Breakdown</h3>
                                <Sparkles size={16} className="text-[#00E5FF]" />
                            </div>

                            <div className="space-y-4">
                                {categoryBreakdown.length > 0 ? (
                                    categoryBreakdown.map((cat) => (
                                        <div key={cat.name} className="space-y-2">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-semibold text-slate-300">{cat.name}</span>
                                                <span className="font-mono text-xs font-bold text-[#00E5FF]">{cat.count} items ({cat.percentage}%)</span>
                                            </div>
                                            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-sky-400 to-[#00E5FF] transition-all duration-1000"
                                                    style={{ width: `${cat.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-500 text-center py-4">No category data available.</p>
                                )}
                            </div>

                            <div className="pt-4 border-t border-white/[0.06] space-y-3">
                                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] space-y-1.5">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 size={14} className="text-emerald-400" />
                                        <span className="text-xs font-bold text-white">GLA Administration Audit</span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 leading-relaxed">
                                        Faculty moderators inspect every claim to protect student privacy and ensure verified handovers.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default StudentDashboard;
