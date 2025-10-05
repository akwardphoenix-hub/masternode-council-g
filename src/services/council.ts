import { fetchSafe } from '../lib/fetchSafe';

const isTestMode = (import.meta as any)?.env?.MODE === 'test' || 
  (typeof process !== 'undefined' && (process.env.NODE_ENV === 'test' || !!process.env.CI));

export interface Proposal {
  id: string;
  title: string;
  description?: string;
  createdAt: string;       // ISO 8601
  votingEndsAt?: string;   // ISO 8601
  status: 'active' | 'pending' | 'approved' | 'rejected';
}

export interface Vote {
  proposalId: string;
  actor: string;
  vote: 'approve' | 'reject' | 'abstain';
  timestamp: string; // ISO
}

export interface AuditEntry {
  type: 'proposal:create' | 'vote:cast' | 'proposal:update';
  id: string;           // proposalId
  actor: string;
  timestamp: string;    // ISO
  vote?: Vote['vote'];
}

const LS = {
  proposals: 'council.proposals',
  votes: 'council.votes',
  audit: 'council.audit'
};

async function loadJSON<T>(path: string): Promise<T> {
  const res = await fetchSafe(path);
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
  return res.json();
}

// Local storage helpers for test/offline writes
function readLS<T>(key: string, fallback: T): T {
  if (typeof localStorage === 'undefined') return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeLS<T>(key: string, data: T): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

export async function getProposals(): Promise<Proposal[]> {
  if (isTestMode) {
    const cached = readLS<Proposal[]>(LS.proposals, []);
    if (cached.length > 0) return cached;
    const data = await loadJSON<Proposal[]>('/mock/proposals.json');
    writeLS(LS.proposals, data);
    return data;
  }
  // Real API call would go here
  return loadJSON<Proposal[]>('/mocks/proposals.json');
}

export async function getVotes(): Promise<Vote[]> {
  if (isTestMode) {
    const cached = readLS<Vote[]>(LS.votes, []);
    if (cached.length > 0) return cached;
    const data = await loadJSON<Vote[]>('/mock/votes.json');
    writeLS(LS.votes, data);
    return data;
  }
  // Real API call would go here
  return loadJSON<Vote[]>('/mocks/votes.json');
}

export async function getAuditLog(): Promise<AuditEntry[]> {
  if (isTestMode) {
    const cached = readLS<AuditEntry[]>(LS.audit, []);
    if (cached.length > 0) return cached;
    const data = await loadJSON<AuditEntry[]>('/mock/audit.json');
    writeLS(LS.audit, data);
    return data;
  }
  // Real API call would go here
  return loadJSON<AuditEntry[]>('/mocks/audit.json');
}

export async function castVote(vote: Vote): Promise<void> {
  const votes = await getVotes();
  votes.push(vote);
  writeLS(LS.votes, votes);
  
  const audit = await getAuditLog();
  audit.push({
    type: 'vote:cast',
    id: vote.proposalId,
    actor: vote.actor,
    timestamp: vote.timestamp,
    vote: vote.vote
  });
  writeLS(LS.audit, audit);
}

export async function createProposal(proposal: Proposal): Promise<void> {
  const proposals = await getProposals();
  proposals.push(proposal);
  writeLS(LS.proposals, proposals);
  
  const audit = await getAuditLog();
  audit.push({
    type: 'proposal:create',
    id: proposal.id,
    actor: 'system',
    timestamp: proposal.createdAt
  });
  writeLS(LS.audit, audit);
}
