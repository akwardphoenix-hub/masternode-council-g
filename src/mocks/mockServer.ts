import { USE_MOCKS } from '../env';
import { fetchSafe } from '../lib/fetchSafe';

export async function fetchJSON(path: string) {
  if (USE_MOCKS) {
    // Map API paths → local fixtures
    if (path.includes('/proposals')) return (await fetchSafe('/mocks/proposals.json')).json();
    if (path.includes('/votes')) return (await fetchSafe('/mocks/votes.json')).json();
    if (path.includes('/audit')) return (await fetchSafe('/mocks/audit.json')).json();
  }
  // fallback to real fetch if not mocked
  return (await fetchSafe(path)).json();
}
