import api from './mongo.api';

/**
 * Create user profile in MongoDB
 */
export const createUserProfile = async (userId, userData) => {
    try {
        const response = await api.post('/users/sync', {
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
        const response = await api.get('/users/me');
        return response.data;
    } catch (error) {
        console.warn('GET /users/me failed, trying POST /users/sync:', error.message);
        try {
            const syncResponse = await api.post('/users/sync', {});
            return syncResponse.data;
        } catch (syncErr) {
            console.error('Error getting user profile:', syncErr);
            throw new Error('Failed to get user profile');
        }
    }
};

/**
 * Update user profile in MongoDB
 */
export const updateUserProfile = async (userId, updates) => {
    try {
        const response = await api.post('/users/sync', updates);
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
