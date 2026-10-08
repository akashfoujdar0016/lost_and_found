import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { createItem } from '../../services/lostfound.service';
import { uploadMultipleImagesDirect } from '../../services/cloudinary.service';
import { useAuth } from '../../context/AuthContext';
import {
    Camera, MapPin, CheckCircle,
    Send, Sparkles, AlertCircle, ArrowRight, ArrowLeft
} from 'lucide-react';

const ReportWizard = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        type: 'lost',
        title: '',
        category: 'Electronics',
        location: '',
        lastTimeSeen: '',
        color: '',
        description: '',
        imageFiles: [],
        images: []
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createdItemId, setCreatedItemId] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setFormData(prev => ({ ...prev, imageFiles: files }));
            const previews = files.map(file => URL.createObjectURL(file));
            setFormData(prev => ({ ...prev, images: previews }));
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError('');
        try {
            let imageUrls = [];
            if (formData.imageFiles.length > 0) {
                const uploadResults = await uploadMultipleImagesDirect(formData.imageFiles);
                imageUrls = uploadResults.map(res => res.url);
            }

            const result = await createItem(
                {
                    ...formData,
                    images: imageUrls
                },
                user.id
            );
            setCreatedItemId(result.id);
            setStep(4);
        } catch (err) {
            console.error('Report submission error:', err);
            setError(err.message || 'Failed to submit report');
        } finally {
            setIsSubmitting(false);
        }
    };

    const categories = ['Electronics', 'Wallets', 'Keys', 'Books', 'Documents', 'Clothing', 'Accessories', 'Other'];

    return (
        <Layout>
            <div className="max-w-3xl mx-auto pb-20 animate-fade-in space-y-8">
                {step < 4 && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00E5FF] bg-[#00E5FF]/10 px-3 py-1 rounded-full border border-[#00E5FF]/20 font-mono">
                                    Step 0{step} of 03
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
                                    Initialize Report
                                </h2>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex gap-2">
                            {[1, 2, 3].map(i => (
                                <div
                                    key={i}
                                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                                        step >= i
                                            ? 'bg-[#00E5FF] shadow-[0_0_12px_#00E5FF]'
                                            : 'bg-white/10'
                                    }`}
                                ></div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="true-glass rounded-3xl p-6 sm:p-10 min-h-[480px] flex flex-col relative overflow-hidden">
                    {isSubmitting && (
                        <div className="absolute inset-0 bg-[#09090b]/80 backdrop-blur-xl z-50 flex flex-col items-center justify-center gap-4">
                            <div className="w-12 h-12 border-4 border-[#00E5FF] border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-xs font-mono uppercase tracking-widest text-[#00E5FF]">Publishing Report to Network...</p>
                        </div>
                    )}

                    {/* STEP 1: Type & Classification */}
                    {step === 1 && (
                        <div className="space-y-8 flex-1 flex flex-col justify-between">
                            <div className="space-y-6">
                                <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#00E5FF] flex items-center gap-2">
                                    <Sparkles size={14} /> Step 01: Intelligent Classification
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Type: Lost */}
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, type: 'lost' }))}
                                        className={`p-6 rounded-2xl border text-left transition-all duration-300 ${
                                            formData.type === 'lost'
                                                ? 'bg-[#00E5FF]/10 border-[#00E5FF] shadow-[0_10px_30px_rgba(0,229,255,0.2)]'
                                                : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center font-bold transition-all ${
                                            formData.type === 'lost' ? 'bg-[#00E5FF] text-slate-950 shadow-md' : 'bg-white/10 text-white'
                                        }`}>
                                            ?
                                        </div>
                                        <h5 className="font-extrabold text-sm text-white">I Lost Something</h5>
                                        <p className="text-[11px] text-slate-400 font-medium mt-1">Misplaced a personal belonging</p>
                                    </button>

                                    {/* Type: Found */}
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, type: 'found' }))}
                                        className={`p-6 rounded-2xl border text-left transition-all duration-300 ${
                                            formData.type === 'found'
                                                ? 'bg-amber-400/10 border-amber-400 shadow-[0_10px_30px_rgba(245,158,11,0.2)]'
                                                : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl mb-3 flex items-center justify-center font-bold transition-all ${
                                            formData.type === 'found' ? 'bg-amber-400 text-slate-950 shadow-md' : 'bg-white/10 text-white'
                                        }`}>
                                            !
                                        </div>
                                        <h5 className="font-extrabold text-sm text-white">I Found Something</h5>
                                        <p className="text-[11px] text-slate-400 font-medium mt-1">Found an item on campus</p>
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-slate-300">Item Headline</label>
                                    <input
                                        type="text"
                                        className="w-full"
                                        placeholder="e.g. My Silver Macbook Pro 14-inch"
                                        value={formData.title}
                                        onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-slate-300">Classification Category</label>
                                    <select
                                        className="w-full"
                                        value={formData.category}
                                        onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/[0.06]">
                                <button
                                    onClick={() => setStep(2)}
                                    disabled={!formData.title.trim()}
                                    className="w-full py-4 rounded-full magnetic-btn-primary text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-40"
                                >
                                    <span>Continue to Context</span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Location & Context */}
                    {step === 2 && (
                        <div className="space-y-8 flex-1 flex flex-col justify-between">
                            <div className="space-y-6">
                                <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#00E5FF] flex items-center gap-2">
                                    <MapPin size={14} /> Step 02: Spatial &amp; Temporal Context
                                </h4>

                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-slate-300">Location on Campus</label>
                                    <input
                                        type="text"
                                        className="w-full"
                                        placeholder="e.g. Library 2nd Floor, Near Cafeteria"
                                        value={formData.location}
                                        onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-slate-300">Last Time Seen</label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input
                                            type="date"
                                            className="w-full"
                                            value={formData.lastTimeSeen ? formData.lastTimeSeen.split('T')[0] : ''}
                                            max={new Date().toISOString().split('T')[0]}
                                            onChange={e => {
                                                const date = e.target.value;
                                                const time = formData.lastTimeSeen ? formData.lastTimeSeen.split('T')[1] : '12:00';
                                                setFormData(p => ({ ...p, lastTimeSeen: `${date}T${time}` }));
                                            }}
                                        />
                                        <input
                                            type="time"
                                            className="w-full"
                                            value={formData.lastTimeSeen ? formData.lastTimeSeen.split('T')[1] : ''}
                                            onChange={e => {
                                                const time = e.target.value;
                                                const date = formData.lastTimeSeen ? formData.lastTimeSeen.split('T')[0] : new Date().toISOString().split('T')[0];
                                                setFormData(p => ({ ...p, lastTimeSeen: `${date}T${time}` }));
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-slate-300">Color / Distinct Features</label>
                                    <input
                                        type="text"
                                        className="w-full"
                                        placeholder="e.g. Space Gray with sticker on lid"
                                        value={formData.color}
                                        onChange={e => setFormData(p => ({ ...p, color: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-semibold text-slate-300">Detailed Observation</label>
                                    <textarea
                                        rows={3}
                                        className="w-full"
                                        placeholder="Add any unique scratches, serial numbers, or additional observations..."
                                        value={formData.description}
                                        onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/[0.06] flex gap-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    disabled={!formData.location.trim()}
                                    className="flex-1 py-4 rounded-full magnetic-btn-primary text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-40"
                                >
                                    <span>Review &amp; Upload</span>
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Images & Confirmation */}
                    {step === 3 && (
                        <div className="space-y-8 flex-1 flex flex-col justify-between">
                            <div className="space-y-6">
                                <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#00E5FF] flex items-center gap-2">
                                    <Camera size={14} /> Step 03: Visual Confirmation
                                </h4>

                                {formData.images.length === 0 ? (
                                    <div className="p-8 rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] flex flex-col items-center justify-center text-center hover:border-[#00E5FF]/40 transition-all">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageSelect}
                                            className="hidden"
                                            id="image-upload"
                                        />
                                        <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center space-y-3">
                                            <div className="w-14 h-14 bg-[#00E5FF]/10 text-[#00E5FF] rounded-2xl flex items-center justify-center border border-[#00E5FF]/20">
                                                <Camera size={28} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-white">Click to Select Photos</p>
                                                <p className="text-[10px] text-slate-400">Add photos to improve matching accuracy</p>
                                            </div>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-3 gap-3">
                                            {formData.images.map((img, idx) => (
                                                <div key={idx} className="aspect-square rounded-xl overflow-hidden border border-white/20 bg-white/5">
                                                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageSelect}
                                            className="hidden"
                                            id="image-reupload"
                                        />
                                        <label htmlFor="image-reupload" className="text-xs font-bold text-[#00E5FF] hover:text-cyan-300 cursor-pointer uppercase tracking-wider inline-block">
                                            Change Photos
                                        </label>
                                    </div>
                                )}

                                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                                        <AlertCircle size={14} className="text-[#00E5FF]" />
                                        <span>GLA Campus Protocol</span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                                        By publishing this report, you confirm that all information provided is accurate and complies with university policy.
                                    </p>
                                </div>

                                {error && (
                                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                                        {error}
                                    </div>
                                )}
                            </div>

                            <div className="pt-6 border-t border-white/[0.06] flex gap-4">
                                <button
                                    onClick={() => setStep(2)}
                                    className="px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex-1 py-4 rounded-full magnetic-btn-primary text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-40"
                                >
                                    <Send size={16} />
                                    <span>{isSubmitting ? 'Publishing...' : 'Publish Report'}</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Success Confirmation */}
                    {step === 4 && (
                        <div className="py-8 flex-1 flex flex-col items-center justify-center text-center space-y-6">
                            <div className="w-20 h-20 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center text-[#00E5FF] shadow-[0_0_40px_rgba(0,229,255,0.3)]">
                                <CheckCircle size={44} />
                            </div>

                            <div className="space-y-2 max-w-sm">
                                <h2 className="text-2xl font-black text-white">Report Published</h2>
                                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                    Your item report has been logged to the GLA network. The system is scanning for matches.
                                </p>
                            </div>

                            {createdItemId && (
                                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center font-mono space-y-1">
                                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Report Reference Token</span>
                                    <span className="text-sm font-bold text-[#00E5FF] tracking-wider block">{createdItemId}</span>
                                </div>
                            )}

                            <div className="pt-4 space-y-3 w-full max-w-xs">
                                <button
                                    onClick={() => navigate('/student/dashboard')}
                                    className="w-full py-4 rounded-full magnetic-btn-primary text-xs font-extrabold uppercase tracking-widest"
                                >
                                    Return to Dashboard
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ReportWizard;
