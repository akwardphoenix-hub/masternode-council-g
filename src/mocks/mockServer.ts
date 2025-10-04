import { USE_MOCKS } from '../env';

export async function fetchJSON(path: string) {
  if (USE_MOCKS) {
    // Map API paths → local fixtures
    if (path.includes('/proposals')) return (await fetch('/mocks/proposals.json')).json();
    if (path.includes('/votes')) return (await fetch('/mocks/votes.json')).json();
    if (path.includes('/audit')) return (await fetch('/mocks/audit.json')).json();
  }
  // fallback to real fetch if not mocked
  return (await fetch(path)).json();
}
