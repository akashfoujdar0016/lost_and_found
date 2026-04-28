import api from './mongo.api';

/**
 * Create user profile in MongoDB
 */
export const createUserProfile = async (userId, userData) => {
    try {
        const response = await api.post('/users/sync', {
            uid: userId,
            ...userData
        });
        return { success: true, user: response.data };
    } catch (error) {
        throw new Error('Failed to create user profile: ' + error.message);
    }
};

/**
 * Get user profile from MongoDB
 */
export const getUserProfile = async (userId) => {
    try {
        const response = await api.post('/users/sync', { uid: userId });
        return response.data;
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw new Error('Failed to get user profile');
    }
};

/**
 * Update user profile in MongoDB
 */
export const updateUserProfile = async (userId, updates) => {
    try {
        const response = await api.post('/users/sync', {
            uid: userId,
            ...updates
        });
        return { success: true, user: response.data };
    } catch (error) {
        console.error('Error updating profile:', error);
        throw new Error('Failed to update profile');
    }
};

/**
 * Check if a user with the given identifier (Roll No/Faculty ID) exists
 */
export const checkIdentifierExists = async (identifier, role) => {
    try {
        // Simple check against backend
        const response = await api.get(`/users/check/${identifier}?role=${role}`);
        return response.data.exists;
    } catch (error) {
        return false;
    }
};

/**
 * Upload user documents (stub for future expansion)
 */
export const uploadUserDocuments = async (userId, files) => {
    try {
        if (!files || files.length === 0) return [];
        // For now, reuse the item image upload logic structure if needed, 
        // but here we just return a success message or mock URLs
        return ['doc_uploaded_success'];
    } catch (error) {
        console.error('Error uploading documents:', error);
        throw new Error('Failed to upload documents');
    }
};

export default {
    createUserProfile,
    getUserProfile,
    updateUserProfile,
    checkIdentifierExists,
    uploadUserDocuments
};

