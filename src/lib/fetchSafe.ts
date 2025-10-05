/**
 * Safe fetch wrapper that blocks external calls in test mode
 * Allows local development servers (localhost, 127.0.0.1, 0.0.0.0)
 * Mocks GitHub AI/runtime endpoints when in test mode
 */
export async function fetchSafe(url: string, init?: RequestInit) {
  const mode = (import.meta as any)?.env?.MODE || (typeof process !== 'undefined' ? process.env.NODE_ENV : undefined);
  const isCI = typeof process !== 'undefined' ? !!process.env.CI : false;
  const isTest = mode === 'test' || mode === 'ci' || isCI;

  // Allow local development servers
  const isLocalhost =
    url.startsWith('http://127.0.0.1') ||
    url.startsWith('http://localhost') ||
    url.startsWith('http://0.0.0.0') ||
    url.startsWith('http://[::1]');

  const isExternal = /^https?:\/\//i.test(url) && !isLocalhost;

  // In test mode, mock GitHub AI/runtime endpoints
  if (isTest && isExternal) {
    // Mock runtime.github.com responses
    if (url.includes('runtime.github.com')) {
      return new Response(JSON.stringify({
        status: 'ok',
        message: 'Mocked runtime.github.com response'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Mock models.github.ai responses
    if (url.includes('models.github.ai')) {
      return new Response(JSON.stringify({
        status: 'ok',
        model: 'mock-model',
        response: 'Mocked models.github.ai response'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Block all other external calls in test mode
    throw new Error(`External fetch blocked in test mode: ${url}`);
  }
  
  return fetch(url, init);
}
