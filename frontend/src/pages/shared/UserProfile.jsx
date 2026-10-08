import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, CreditCard, Building, ArrowLeft, Save, Trash2, FileText, CheckCircle, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getUserProfile, updateUserProfile, uploadUserDocuments } from '../../services/user.service';
import { getMyReports, getMyClaims } from '../../services/lostfound.service';

const UserProfile = () => {
    const navigate = useNavigate();
    const { user, refreshUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [stats, setStats] = useState({ reports: 0, claims: 0 });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [editData, setEditData] = useState({});
    const [localPreview, setLocalPreview] = useState(null);
    const fileInputRef = React.useRef(null);

    useEffect(() => {
        loadProfile();
    }, [user]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError('');
            if (user) {
                const [data, reports, claims] = await Promise.all([
                    getUserProfile(user.id).catch(err => {
                        console.warn('Profile API warning, using context fallback:', err);
                        return null;
                    }),
                    getMyReports(user.id).catch(() => []),
                    getMyClaims(user.id).catch(() => [])
                ]);
                const mergedProfile = { ...user, ...(data || {}) };
                setProfile(mergedProfile);
                setEditData(mergedProfile);
                setStats({
                    reports: Array.isArray(reports) ? reports.length : 0,
                    claims: Array.isArray(claims) ? claims.length : 0
                });
            }
        } catch (err) {
            console.error('Profile load error:', err);
            if (user) {
                setProfile(user);
                setEditData(user);
            } else {
                setError('Failed to load profile');
            }
        } finally {
            setLoading(false);
        }
    };

    const isPhotoDirty = !!(editData.newPhoto || editData.removePhoto);

    const handlePhotoSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditData(prev => ({ ...prev, newPhoto: file, removePhoto: false }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setLocalPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePhotoDelete = () => {
        setEditData(prev => ({ ...prev, newPhoto: null, removePhoto: true }));
        setLocalPreview('DELETE');
    };

    const handleCancelPhoto = () => {
        setEditData(prev => ({ ...prev, newPhoto: null, removePhoto: false }));
        setLocalPreview(null);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError('');

            // Upload photo if changed
            if (editData.newPhoto) {
                await uploadUserDocuments(user.id, null, editData.newPhoto);
            } else if (editData.removePhoto) {
                await updateUserProfile(user.id, {
                    profilePhotoUrl: null,
                    profilePhotoPublicId: null
                });
            }

            await loadProfile();
            await refreshUser();
            setLocalPreview(null);
            setEditData({});
        } catch (err) {
            console.error('Profile update error:', err);
            setError('Failed to update profile: ' + (err.message || 'Unknown error'));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#00E5FF] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs font-mono uppercase tracking-widest text-slate-400">Loading Verified Profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 sm:p-10 relative overflow-x-hidden selection:bg-[#00E5FF]/20 selection:text-[#00E5FF]">
            {/* Background Ambient Mesh Glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#0a1128]/70 blur-[180px] rounded-full"></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate(user?.role ? `/${user.role}/dashboard` : '/')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
                    >
                        <ArrowLeft size={18} />
                        Back to Portal
                    </button>
                </div>

                {/* Profile Floating Card */}
                <div className="rounded-3xl bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.05] shadow-[0_30px_60px_-15px_rgba(0,229,255,0.08)] p-8 sm:p-10 space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/[0.06]">
                        <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00E5FF] bg-[#00E5FF]/10 px-3 py-1 rounded-full border border-[#00E5FF]/20">
                                Verified Identity
                            </span>
                            <h1 className="text-3xl font-black text-white tracking-tight mt-2">My Account Profile</h1>
                            <p className="text-xs text-slate-400 mt-1">GLA University Authenticated Credentials</p>
                        </div>

                        {isPhotoDirty && (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleCancelPhoto}
                                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-xs font-bold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-2 rounded-full bg-[#00E5FF] text-slate-950 hover:bg-cyan-300 transition-all text-xs font-extrabold uppercase tracking-wider shadow-[0_10px_25px_rgba(0,229,255,0.3)]"
                                >
                                    <Save size={14} />
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                            {error}
                        </div>
                    )}

                    {/* Profile Photo Section */}
                    <div className="flex flex-col items-center">
                        <div className="relative group">
                            <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-white/20 bg-white/5 flex items-center justify-center shadow-xl">
                                {localPreview === 'DELETE' ? (
                                    <User size={56} className="text-slate-500" />
                                ) : localPreview ? (
                                    <img src={localPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : profile?.profilePhotoUrl ? (
                                    <img src={profile.profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={56} className="text-slate-500" />
                                )}
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handlePhotoSelect}
                                accept="image/*"
                                className="hidden"
                            />
                            <div className="absolute bottom-0 right-0 flex gap-1">
                                {((localPreview && localPreview !== 'DELETE') || (!localPreview && profile?.profilePhotoUrl)) ? (
                                    <button
                                        onClick={handlePhotoDelete}
                                        className="p-2 rounded-full bg-rose-500 text-white shadow-lg hover:bg-rose-600 transition-all"
                                        title="Remove Photo"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="p-2 rounded-full bg-[#00E5FF] text-slate-950 shadow-lg hover:bg-cyan-300 transition-all"
                                        title="Upload Photo"
                                    >
                                        <Camera size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                                <User size={14} className="text-[#00E5FF]" />
                                Full Name
                            </label>
                            <div className="px-4 py-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-white text-xs font-semibold">
                                {profile?.name || user?.name || 'Not set'}
                            </div>
                        </div>

                        {/* Date of Birth */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                                <Calendar size={14} className="text-[#00E5FF]" />
                                Date of Birth
                            </label>
                            <div className="px-4 py-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-white text-xs font-semibold">
                                {profile?.dateOfBirth || user?.dateOfBirth || 'Not set'}
                            </div>
                        </div>

                        {/* Mobile Number */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                                <Phone size={14} className="text-[#00E5FF]" />
                                Mobile Number
                            </label>
                            <div className="px-4 py-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-white text-xs font-semibold font-mono">
                                {profile?.mobile || user?.mobile || 'Not set'}
                            </div>
                        </div>

                        {/* Personal Email */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                                <Mail size={14} className="text-[#00E5FF]" />
                                Personal Email
                            </label>
                            <div className="px-4 py-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-white text-xs font-semibold truncate">
                                {profile?.personalEmail || profile?.email || user?.email || 'Not set'}
                            </div>
                        </div>

                        {/* Identifier */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                                <CreditCard size={14} className="text-[#00E5FF]" />
                                {(profile?.role || user?.role) === 'faculty' ? 'Faculty ID' : 'University Roll Number'}
                            </label>
                            <div className="px-4 py-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-white text-xs font-semibold font-mono">
                                {profile?.identifier || user?.identifier || 'Not set'}
                            </div>
                        </div>

                        {/* University Email */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                                <Building size={14} className="text-[#00E5FF]" />
                                University Email
                            </label>
                            <div className="px-4 py-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-white text-xs font-semibold truncate">
                                {profile?.universityEmail || profile?.email || user?.email || 'Not set'}
                            </div>
                        </div>
                    </div>

                    {/* Account Status & Activity Stats */}
                    <div className="grid md:grid-cols-2 gap-6 pt-4">
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Account Verification</h3>
                            <div className="space-y-2 text-xs">
                                <div className="flex items-center gap-2 text-slate-300">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
                                    <span>GLA Email Verified</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
                                    <span>Mobile Number Verified</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider">My Portal Activity</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-sky-400/10 text-sky-400 border border-sky-400/20">
                                        <FileText size={18} />
                                    </div>
                                    <div>
                                        <div className="text-xl font-black text-white">{stats.reports}</div>
                                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Reports</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-purple-400/10 text-purple-400 border border-purple-400/20">
                                        <CheckCircle size={18} />
                                    </div>
                                    <div>
                                        <div className="text-xl font-black text-white">{stats.claims}</div>
                                        <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Claims</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
