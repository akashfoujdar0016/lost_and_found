import api from './mongo.api';

// Helper to get emoji for category
export const getCategoryEmoji = (category) => {
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

export const getColorForCategory = (category) => {
    const colorMap = {
        'electronics': 'bg-blue-500/30',
        'accessories': 'bg-purple-500/30',
        'keys': 'bg-yellow-500/30',
        'wallet': 'bg-pink-500/30',
        'phone': 'bg-cyan-500/30',
        'laptop': 'bg-indigo-500/30',
        'books': 'bg-orange-500/30',
        'clothing': 'bg-red-500/30',
        'jewelry': 'bg-emerald-500/30',
        'cards': 'bg-teal-500/30',
        'other': 'bg-gray-500/30'
    };
    return colorMap[category?.toLowerCase()] || 'bg-gray-500/30';
};

// --- Items Activity ---

export const getLatestActivity = async (limitCount = 3) => {
    try {
        const response = await api.get('/items/latest', { params: { limit: limitCount } });
        return response.data.map(item => ({
            id: item._id,
            emoji: getCategoryEmoji(item.category),
            bgColor: getColorForCategory(item.category),
            title: item.title,
            status: item.type === 'lost' ? 'Lost' : 'Found',
            statusColor: item.type === 'lost' ? 'text-red-400' : 'text-green-400',
            location: item.location,
            timestamp: new Date(item.createdAt)
        }));
    } catch (error) {
        console.error('Error fetching latest activity:', error);
        return [];
    }
};

export const createItem = async (itemData, userId) => {
    try {
        const response = await api.post('/items', { ...itemData, reportedBy: userId });
        return {
            id: response.data._id,
            ...response.data
        };
    } catch (error) {
        console.error('Error creating item:', error);
        throw new Error('Failed to create item report');
    }
};

export const getItems = async (filters = {}) => {
    try {
        const response = await api.get('/items', { params: filters });
        return response.data.map(item => ({
            ...item,
            id: item._id
        }));
    } catch (error) {
        console.error('Error fetching items:', error);
        return [];
    }
};

export const getItemById = async (itemId) => {
    try {
        const response = await api.get(`/items/${itemId}`);
        return {
            ...response.data,
            id: response.data._id
        };
    } catch (error) {
        console.error('Error fetching item:', error);
        return null;
    }
};

export const updateItemStatus = async (itemId, status) => {
    try {
        await api.patch(`/items/${itemId}/status`, { status });
        return { success: true };
    } catch (error) {
        console.error('Error updating item status:', error);
        throw new Error('Failed to update item status');
    }
};

export const deleteItem = async (itemId) => {
    try {
        await api.delete(`/items/${itemId}`);
        return { success: true };
    } catch (error) {
        console.error('Error deleting item:', error);
        throw new Error('Failed to delete item');
    }
};

export const getMyReports = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}/reports`);
        return response.data.map(item => ({
            ...item,
            id: item._id
        }));
    } catch (error) {
        console.error('Error fetching user reports:', error);
        return [];
    }
};

// --- Claims ---

export const createClaim = async (itemId, claimData, userId) => {
    try {
        const response = await api.post('/claims', {
            itemId,
            claimantId: userId,
            ...claimData
        });
        return {
            id: response.data._id,
            ...response.data
        };
    } catch (error) {
        console.error('Error creating claim:', error);
        throw new Error('Failed to create claim');
    }
};

export const getPendingClaims = async () => {
    try {
        const response = await api.get('/claims/pending');
        return response.data.map(claim => ({
            ...claim,
            id: claim._id
        }));
    } catch (error) {
        console.error('Error fetching pending claims:', error);
        return [];
    }
};

export const verifyClaim = async (claimId, decision, note) => {
    try {
        await api.post(`/claims/${claimId}/verify`, { decision, note });
        return { success: true };
    } catch (error) {
        console.error('Error verifying claim:', error);
        throw new Error('Failed to verify claim');
    }
};

export const getMyClaims = async (userId) => {
    try {
        const response = await api.get(`/users/${userId}/claims`);
        return response.data.map(claim => ({
            ...claim,
            id: claim._id
        }));
    } catch (error) {
        console.error('Error fetching user claims:', error);
        return [];
    }
};

// --- Images ---

export const uploadItemImages = async (files) => {
    try {
        if (!files || files.length === 0) return [];
        const uploadPromises = Array.from(files).map(async (file) => {
            const reader = new FileReader();
            const base64Promise = new Promise((resolve) => {
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
            const base64 = await base64Promise;
            const response = await api.post('/upload', { imageBase64: base64 });
            return response.data.url;
        });
        return await Promise.all(uploadPromises);
    } catch (error) {
        console.error('Error uploading images:', error);
        throw new Error('Failed to upload images');
    }
};

export default {
    getLatestActivity,
    createItem,
    getItems,
    getItemById,
    updateItemStatus,
    getMyReports,
    getMyClaims,
    createClaim,
    getPendingClaims,
    verifyClaim,
    deleteItem,
    uploadItemImages,
    getCategoryEmoji,
    getColorForCategory
};
