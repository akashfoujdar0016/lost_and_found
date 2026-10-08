import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, GraduationCap, Building2, Shield } from 'lucide-react';
import { registerUser } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { refreshUser } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        role: 'student', // default role
        name: '',
        dateOfBirth: '',
        universityEmail: '',
        personalEmail: '', 
        mobile: '',
        identifier: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const validateStep1 = () => {
        if (!formData.name.trim()) {
            setError('Please enter your full name');
            return false;
        }
        if (!formData.identifier.trim()) {
            setError('Please enter your ' + (formData.role === 'student' ? 'Roll Number' : 'Faculty ID'));
            return false;
        }
        if (!formData.mobile || formData.mobile.length !== 10) {
            setError('Mobile number must be a valid 10-digit number');
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.universityEmail || !emailRegex.test(formData.universityEmail)) {
            setError('Please enter a valid University Email');
            return false;
        }

        if (!formData.personalEmail || !emailRegex.test(formData.personalEmail)) {
            setError('Please enter a valid Personal Email');
            return false;
        }

        if (!formData.password || formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }

        return true;
    };

    const handleNextStep = () => {
        setError('');
        if (validateStep1()) {
            setCurrentStep(2);
        }
    };

    const handleRegistrationSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateStep2()) return;

        try {
            setLoading(true);
            const result = await registerUser(
                formData.universityEmail.trim(),
                formData.password,
                {
                    role: formData.role,
                    name: formData.name.trim(),
                    dateOfBirth: formData.dateOfBirth || '2000-01-01',
                    universityEmail: formData.universityEmail.trim(),
                    personalEmail: formData.personalEmail.trim(),
                    mobile: formData.mobile,
                    identifier: formData.identifier.trim(),
                    emailVerified: true,
                    mobileVerified: true
                }
            );

            if (result.success) {
                await refreshUser();
                setCurrentStep(3); // Success state
            }
        } catch (err) {
            setError(err.message || 'Registration failed. Please check your information.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#090b0e] text-slate-100 bg-grid-pattern relative overflow-x-hidden flex flex-col justify-center items-center p-6">
            {/* Return Link */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors group"
            >
                <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={16} />
                <span>Return to Portal</span>
            </button>

            {/* Registration Card */}
            <div className="w-full max-w-lg">
                <div className="rounded-3xl bg-[#11141b]/90 border border-white/[0.08] p-8 md:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
                    {/* Header */}
                    <div className="text-center mb-8 space-y-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400 bg-sky-400/10 px-3 py-1 rounded border border-sky-400/20">
                            Identity Registration
                        </span>
                        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                            Create Account
                        </h1>
                        <p className="text-slate-400 text-xs">
                            Step {currentStep > 2 ? 2 : currentStep} of 2 • GLA Lost & Found Network
                        </p>
                    </div>

                    {/* Step Progress Bar */}
                    {currentStep <= 2 && (
                        <div className="grid grid-cols-2 gap-2 mb-8">
                            <div className={`h-1.5 rounded-full transition-all ${currentStep >= 1 ? 'bg-sky-400' : 'bg-white/10'}`}></div>
                            <div className={`h-1.5 rounded-full transition-all ${currentStep >= 2 ? 'bg-sky-400' : 'bg-white/10'}`}></div>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
                            {error}
                        </div>
                    )}

                    {/* STEP 1: Role & Basic Identity */}
                    {currentStep === 1 && (
                        <div className="space-y-5">
                            {/* Role Switcher */}
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                                    Account Role
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, role: 'student' }))}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                                            formData.role === 'student'
                                                ? 'bg-sky-400/10 border-sky-400/40 text-sky-400'
                                                : 'bg-[#161a24] border-white/10 text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        <GraduationCap size={18} />
                                        <span>Student</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(p => ({ ...p, role: 'faculty' }))}
                                        className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                                            formData.role === 'faculty'
                                                ? 'bg-sky-400/10 border-sky-400/40 text-sky-400'
                                                : 'bg-[#161a24] border-white/10 text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        <Building2 size={18} />
                                        <span>Faculty</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full name"
                                    className="w-full px-4 py-3.5 bg-[#161a24] border border-white/10 rounded-xl text-white text-xs focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                                        {formData.role === 'student' ? 'Roll Number' : 'Faculty ID'}
                                    </label>
                                    <input
                                        type="text"
                                        name="identifier"
                                        value={formData.identifier}
                                        onChange={handleInputChange}
                                        placeholder={formData.role === 'student' ? '2115000123' : 'FAC2024001'}
                                        className="w-full px-4 py-3.5 bg-[#161a24] border border-white/10 rounded-xl text-white text-xs focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                                        Mobile Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={formData.mobile}
                                        onChange={handleInputChange}
                                        placeholder="10-digit number"
                                        maxLength={10}
                                        className="w-full px-4 py-3.5 bg-[#161a24] border border-white/10 rounded-xl text-white text-xs focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="w-full py-4 rounded-xl bg-sky-400 text-slate-950 font-extrabold text-xs uppercase tracking-widest hover:bg-sky-300 transition-all shadow-[0_15px_30px_rgba(56,189,248,0.2)] active:scale-95 mt-4 flex items-center justify-center gap-2"
                            >
                                <span>Continue to Security</span>
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    )}

                    {/* STEP 2: Credentials & Password */}
                    {currentStep === 2 && (
                        <form onSubmit={handleRegistrationSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                                    University Email
                                </label>
                                <input
                                    type="email"
                                    name="universityEmail"
                                    value={formData.universityEmail}
                                    onChange={handleInputChange}
                                    placeholder={formData.role === 'student' ? 'student@gla.ac.in' : 'faculty@gla.ac.in'}
                                    className="w-full px-4 py-3.5 bg-[#161a24] border border-white/10 rounded-xl text-white text-xs focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                                    Personal Email
                                </label>
                                <input
                                    type="email"
                                    name="personalEmail"
                                    value={formData.personalEmail}
                                    onChange={handleInputChange}
                                    placeholder="yourname@gmail.com"
                                    className="w-full px-4 py-3.5 bg-[#161a24] border border-white/10 rounded-xl text-white text-xs focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                                    Create Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Minimum 6 characters"
                                    className="w-full px-4 py-3.5 bg-[#161a24] border border-white/10 rounded-xl text-white text-xs focus:border-sky-400/60 focus:outline-none focus:ring-2 focus:ring-sky-400/20"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(1)}
                                    className="px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-all"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3.5 rounded-xl bg-sky-400 text-slate-950 font-extrabold text-xs uppercase tracking-widest hover:bg-sky-300 transition-all shadow-[0_15px_30px_rgba(56,189,248,0.2)] active:scale-95 disabled:opacity-50"
                                >
                                    {loading ? 'Creating Account...' : 'Complete Registration'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* STEP 3: Success Screen */}
                    {currentStep === 3 && (
                        <div className="text-center py-6 space-y-6">
                            <div className="w-16 h-16 rounded-2xl bg-sky-400/10 border border-sky-400/30 flex items-center justify-center text-sky-400 mx-auto">
                                <Check size={32} />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-black text-white">Registration Complete</h2>
                                <p className="text-slate-400 text-xs max-w-xs mx-auto">
                                    Welcome, <span className="text-white font-bold">{formData.name}</span>. Your {formData.role} identity has been authorized.
                                </p>
                            </div>

                            <button
                                onClick={() => navigate(`/${formData.role}/dashboard`)}
                                className="w-full py-4 rounded-xl bg-sky-400 text-slate-950 font-extrabold text-xs uppercase tracking-widest hover:bg-sky-300 transition-all shadow-[0_15px_30px_rgba(56,189,248,0.2)] active:scale-95"
                            >
                                Launch Dashboard
                            </button>
                        </div>
                    )}

                    {currentStep <= 2 && (
                        <div className="mt-8 text-center pt-6 border-t border-white/[0.08]">
                            <p className="text-slate-400 text-xs">
                                Already registered?{' '}
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-sky-400 font-bold hover:text-sky-300 uppercase tracking-wider ml-1"
                                >
                                    Sign In
                                </button>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Register;
