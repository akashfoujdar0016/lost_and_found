// Mock Firebase Auth using localStorage — no credentials needed

const USERS_KEY  = 'lf_users';
const CURR_KEY   = 'lf_current_user';
const _listeners = new Set();

const uid  = () => 'uid_' + Math.random().toString(36).slice(2, 18);
const load = (k, d = {}) => { try { return JSON.parse(localStorage.getItem(k) || 'null') ?? d; } catch { return d; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const err  = (code, msg) => { const e = new Error(msg || code); e.code = code; throw e; };

let _cur = load(CURR_KEY, null);

const notify = (u) => _listeners.forEach(fn => { try { fn(u); } catch {} });
const setCur  = (u) => { _cur = u; u ? save(CURR_KEY, u) : localStorage.removeItem(CURR_KEY); notify(u); };
const users   = () => load(USERS_KEY, {});
const saveU   = (us) => save(USERS_KEY, us);

// --- Auth mock object (passed around as "auth") ---
export const getAuth = () => ({ _mock: true, get currentUser() { return _cur; } });

// --- Firebase Auth API ---
export const createUserWithEmailAndPassword = async (_auth, email, password) => {
    const us = users();
    if (Object.values(us).find(u => u.email === email)) err('auth/email-already-in-use', 'Email already in use');
    const id = uid();
    const user = { uid: id, email, displayName: null };
    us[id] = { ...user, password };
    saveU(us);
    setCur(user);
    return { user };
};

export const signInWithEmailAndPassword = async (_auth, email, password) => {
    const us = users();
    const found = Object.values(us).find(u => u.email === email);
    if (!found) err('auth/user-not-found', 'No account found with this email');
    if (found.password !== password) err('auth/wrong-password', 'Incorrect password');
    const user = { uid: found.uid, email: found.email, displayName: found.displayName || null };
    setCur(user);
    return { user };
};

export const signOut = async () => setCur(null);

export const onAuthStateChanged = (_auth, callback) => {
    _listeners.add(callback);
    setTimeout(() => { try { callback(_cur); } catch {} }, 0);
    return () => _listeners.delete(callback);
};

export const updateProfile = async (user, profile) => {
    if (!user?.uid) return;
    const us = users();
    if (us[user.uid]) { us[user.uid] = { ...us[user.uid], ...profile }; saveU(us); }
    if (_cur?.uid === user.uid) setCur({ ..._cur, ...profile });
};

// Stubs for phone auth
export class RecaptchaVerifier {
    constructor() {}
    render() { return Promise.resolve(0); }
    verify() { return Promise.resolve(''); }
    clear() {}
}
export const signInWithPhoneNumber = async () => {
    err('auth/operation-not-allowed', 'Phone auth not available in offline mode. Use Email + OTP login.');
};

export default { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, RecaptchaVerifier, signInWithPhoneNumber };
