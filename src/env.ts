export const USE_MOCKS = (import.meta as any).env?.VITE_USE_MOCKS === '1' || 
  (typeof process !== 'undefined' && process.env.USE_MOCKS === '1');
