// Mock Firestore using localStorage — no credentials needed

const STORE_KEY = 'lf_firestore_v1';
const uid = () => 'doc_' + Math.random().toString(36).slice(2, 18);
let _db = null;

const load = () => {
    if (_db) return _db;
    try { _db = JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); } catch { _db = {}; }
    return _db;
};

const save = () => {
    localStorage.setItem(STORE_KEY, JSON.stringify(_db || {}));
};

const getCol = (path) => {
    const db = load();
    if (!db[path]) { db[path] = {}; save(); }
    return db[path];
};

export const getFirestore = () => ({ _mock: true });

// --- Mock Classes ---
class BaseQuery { constructor(path) { this.path = path; } }
class CollRef extends BaseQuery { constructor(path) { super(path); } }
class DocRef { constructor(path, id) { this.path = path; this.id = id; } }

class QuerySnapshot {
    constructor(docs) {
        this.docs = docs;
        this.empty = docs.length === 0;
        this.size = docs.length;
    }
}

class DocSnapshot {
    constructor(id, data = null) {
        this.id = id;
        this._data = data;
    }
    exists() { return !!this._data; }
    data() { return this._data; }
}

// --- Methods ---
export const collection = (db, path) => new CollRef(path);
export const doc = (db, path, id) => {
    if (!id && path.includes('/')) {
        const parts = path.split('/');
        return new DocRef(parts[0], parts[1]);
    }
    return new DocRef(path, id || uid());
};

export const setDoc = async (ref, data, opts) => {
    const col = getCol(ref.path);
    if (opts?.merge && col[ref.id]) col[ref.id] = { ...col[ref.id], ...data };
    else col[ref.id] = data;
    save();
};

export const addDoc = async (cRef, data) => {
    const col = getCol(cRef.path);
    const id = uid();
    col[id] = data;
    save();
    return new DocRef(cRef.path, id);
};

export const updateDoc = async (ref, data) => {
    const col = getCol(ref.path);
    if (!col[ref.id]) throw new Error('Document not found');
    col[ref.id] = { ...col[ref.id], ...data };
    save();
};

export const getDoc = async (ref) => {
    const docData = getCol(ref.path)[ref.id];
    return new DocSnapshot(ref.id, docData);
};

export const getDocs = async (qOrRef) => {
    // Basic mock: returns all docs in collection.
    // Full query processing (where/orderBy) is simplified here.
    const path = qOrRef.path;
    const col = getCol(path);
    const docs = [];
    for (const [id, data] of Object.entries(col)) {
        let match = true;
        // Basic where handling
        if (qOrRef._filters) {
            for (const {f, op, v} of qOrRef._filters) {
                if (op === '==' && data[f] !== v) match = false;
                if (op === '<=' && data[f] > v) match = false;
                if (op === '>=' && data[f] < v) match = false;
            }
        }
        if (match) docs.push(new DocSnapshot(id, data));
    }

    if (qOrRef._orders) {
        docs.sort((a,b) => {
            for (const {f, dir} of qOrRef._orders) {
                const cmp = dir === 'desc' ? -1 : 1;
                if (a.data()[f] < b.data()[f]) return -1 * cmp;
                if (a.data()[f] > b.data()[f]) return 1 * cmp;
            }
            return 0;
        });
    }

    if (qOrRef._limit) docs.splice(qOrRef._limit);

    return new QuerySnapshot(docs);
};

export const query = (ref, ...constraints) => {
    const q = new BaseQuery(ref.path);
    q._filters = [];
    q._orders = [];
    for (const c of constraints) {
        if (c.type === 'where') q._filters.push(c);
        if (c.type === 'orderBy') q._orders.push(c);
        if (c.type === 'limit') q._limit = c.v;
    }
    return q;
};

export const where = (f, op, v) => ({ type: 'where', f, op, v });
export const orderBy = (f, dir = 'asc') => ({ type: 'orderBy', f, dir });
export const limit = (v) => ({ type: 'limit', v });
export const deleteDoc = async (ref) => { const col = getCol(ref.path); delete col[ref.id]; save(); };

export const serverTimestamp = () => Date.now();
export const arrayUnion = (val) => ({ _type: 'arrayUnion', val });
export const increment = (val) => ({ _type: 'increment', val });
export const getCountFromServer = async (query) => {
    const snap = await getDocs(query);
    return { data: () => ({ count: snap.size }) };
};

export default { getFirestore, collection, doc, setDoc, addDoc, updateDoc, getDoc, getDocs, query, where, orderBy, limit, deleteDoc, serverTimestamp, arrayUnion, increment, getCountFromServer };
