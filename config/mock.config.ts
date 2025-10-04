/**
 * Mock Configuration for Testing
 * This file provides local dummy data for API calls when NODE_ENV === 'test' or USE_MOCKS === '1'
 */

export interface MockProposal {
  id: string;
  title: string;
  description: string;
  author: string;
  status: 'pending' | 'active' | 'approved' | 'rejected';
  createdAt: string;
  votingEndsAt?: string;
}

export interface MockVote {
  proposalId: string;
  voter: string;
  vote: 'approve' | 'reject' | 'abstain';
  timestamp: string;
}

export interface MockAuditEntry {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details?: string;
}

export const mockProposals: MockProposal[] = [
  {
    id: 'proposal-001',
    title: 'Integrate U.S. Digital Asset Bill Context',
    description: 'Proposal to align masternode governance with the U.S. Digital Asset Bill context via live Congress.gov API.',
    author: 'node-delta',
    status: 'active',
    createdAt: '2025-10-03T13:00:00Z',
    votingEndsAt: '2025-10-10T23:59:59Z'
  }
];

export const mockVotes: MockVote[] = [];

export const mockAuditLog: MockAuditEntry[] = [];

/**
 * Mock API responses for testing
 */
export const mockAPI = {
  getProposals: () => Promise.resolve(mockProposals),
  getVotes: () => Promise.resolve(mockVotes),
  getAuditLog: () => Promise.resolve(mockAuditLog),
  
  // Mock congress.gov API
  fetchBillData: () => Promise.resolve({
    title: 'Mock Digital Asset Bill',
    sponsor: 'Mock Sponsor',
    introducedDate: '2025-01-01',
    latestAction: 'Introduced in House'
  })
};

/**
 * Check if mocks should be used
 */
export const shouldUseMocks = (): boolean => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NODE_ENV === 'test' || process.env.USE_MOCKS === '1';
  }
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    return (import.meta as any).env.VITE_USE_MOCKS === '1';
  }
  return false;
};
