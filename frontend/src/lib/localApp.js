// Mock Firebase App — no credentials needed
export const initializeApp = (config) => ({ _mock: true, _config: config });
export const getApp = () => ({ _mock: true });
export default { initializeApp, getApp };
