export async function fetchSafe(url: string, init?: RequestInit) {
  const mode = (import.meta as any)?.env?.MODE || (typeof process !== 'undefined' ? process.env.NODE_ENV : undefined);
  const isCI = typeof process !== 'undefined' ? !!process.env.CI : false;
  const isTest = mode === 'test' || mode === 'ci' || isCI;

  const isExternal =
    /^https?:\/\//i.test(url) &&
    !url.startsWith('http://127.0.0.1') &&
    !url.startsWith('http://localhost');

  if (isTest && isExternal) {
    throw new Error(`External fetch blocked in test mode: ${url}`);
  }
  return fetch(url, init);
}
