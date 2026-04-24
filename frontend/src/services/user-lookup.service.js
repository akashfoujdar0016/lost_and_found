import api from './mongo.api';

/**
 * Find user's email by identifier (roll no, faculty ID, mobile, or email)
 * @param {string} identifier - Roll no, faculty ID, mobile number, or email
 * @returns {Promise<string|null>} - User's email if found, null otherwise
 */
export const findUserEmail = async (identifier) => {
    try {
        const response = await api.get('/users/lookup', {
            params: { identifier }
        });
        return response.data.email;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null;
        }
        console.error('Error finding user email:', error);
        return null;
    }
};

export default {
    findUserEmail
};
