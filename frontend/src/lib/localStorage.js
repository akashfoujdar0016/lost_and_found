// Mock Storage using Data URLs in localStorage — no credentials needed

const loadImages = () => JSON.parse(localStorage.getItem('lf_images') || '{}');
const saveImages = (ims) => localStorage.setItem('lf_images', JSON.stringify(ims));

export const getStorage = () => ({ _mock: true });
export const ref = (storage, path) => ({ _path: path || 'default/file_' + Date.now() });

export const uploadBytes = async (r, blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const ims = loadImages();
            ims[r._path] = reader.result;
            saveImages(ims);
            resolve({ ref: r });
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const getDownloadURL = async (r) => {
    const ims = loadImages();
    if (ims[r._path]) return ims[r._path];
    throw new Error('Image not found in local mock storage');
};

export default { getStorage, ref, uploadBytes, getDownloadURL };
