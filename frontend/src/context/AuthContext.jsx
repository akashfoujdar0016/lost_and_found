import React, { createContext, useContext, useState, useEffect } from 'react';
import { logoutUser, onAuthChange } from '../services/auth.service';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        // Initial auth check from localStorage
        const unsubscribe = onAuthChange((userData) => {
            setUser(userData);
            setInitialLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = async () => {
        try {
            await logoutUser();
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const refreshUser = async () => {
        // For JWT, we just re-read from localStorage or we could fetch from API
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    };

    if (initialLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
                <style>{`
                    .spinner-aura {
                        position: absolute;
                        width: 150%;
                        height: 150%;
                        background: radial-gradient(circle, rgba(34, 211, 238, 0.1) 0%, transparent 70%);
                        animation: aura-spin 3s linear infinite;
                    }
                    @keyframes aura-spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
                <div className="relative flex items-center justify-center">
                    <div className="spinner-aura"></div>
                    <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin z-10 shadow-[0_0_15px_rgba(34,211,238,0.4)]"></div>
                </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{
            user,
            logout,
            refreshUser,
            isAuthenticated: !!user,
            role: user?.role || null
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
