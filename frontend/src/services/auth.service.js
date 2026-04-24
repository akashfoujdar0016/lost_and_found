import api from './mongo.api';

/**
 * Sign in with email and password
 */
export const loginWithEmail = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        
        const { token, user } = response.data;
        
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        return {
            success: true,
            user
        };
    } catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Invalid email or password');
    }
};

/**
 * Create new user account
 */
export const registerUser = async (email, password, userData) => {
    try {
        const response = await api.post('/auth/register', {
            email,
            password,
            ...userData
        });

        const { token, user } = response.data;
        
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        return {
            success: true,
            user
        };
    } catch (error) {
        console.error('Registration error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Registration failed');
    }
};

/**
 * Sign out
 */
export const logoutUser = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
};

/**
 * Listen to auth state changes (simplified for JWT)
 */
export const onAuthChange = (callback) => {
    const user = localStorage.getItem('user');
    if (user) {
        callback(JSON.parse(user));
    } else {
        callback(null);
    }
    // Return unsubscribe function (noop for JWT)
    return () => {};
};

export default {
    loginWithEmail,
    registerUser,
    logoutUser,
    onAuthChange
};
