export const OFFLINE = import.meta.env.VITE_OFFLINE === '1';
export const DATA_BASE = '/data'; // force local
export const NOW_ISO = () => new Date().toISOString();
