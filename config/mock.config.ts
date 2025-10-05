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
 * Mock bill data for Congress.gov API responses
 */
export const mockBills = [
  {
    number: 'HR4763',
    title: 'Digital Asset Market Structure and Investor Protection Act',
    sponsor: { name: 'Rep. Johnson' },
    introducedDate: '2023-07-20',
    latestAction: { text: 'Referred to the House Committee on Financial Services' },
    url: 'https://www.congress.gov/bill/118th-congress/house-bill/4763'
  },
  {
    number: 'S2281',
    title: 'Crypto Asset National Security Enhancement Act',
    sponsor: { name: 'Sen. Smith' },
    introducedDate: '2023-07-12',
    latestAction: { text: 'Read twice and referred to the Committee on Banking' },
    url: 'https://www.congress.gov/bill/118th-congress/senate-bill/2281'
  }
];

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
  }),
  
  // Mock fetchBills for congressService
  fetchBills: (limit = 10) => Promise.resolve(mockBills.slice(0, limit)),
  
  // Mock fetchBillById for congressService
  fetchBillById: (billId: string) => {
    const bill = mockBills.find(b => billId.includes(b.number.toLowerCase()));
    return Promise.resolve(bill || mockBills[0]);
  },

  // Mock runtime.github.com API
  fetchGitHubRuntime: () => Promise.resolve({
    status: 'ok',
    message: 'Mocked runtime.github.com response',
    version: '1.0.0-mock'
  }),

  // Mock models.github.ai API
  fetchGitHubModels: () => Promise.resolve({
    status: 'ok',
    model: 'mock-copilot-model',
    response: 'Mocked models.github.ai response',
    capabilities: ['code-completion', 'chat']
  }),

  // Mock api.github.com API
  fetchGitHubAPI: () => Promise.resolve({
    status: 'ok',
    message: 'Mocked api.github.com response',
    data: []
  }),

  // Mock esm.ubuntu.com security updates
  fetchUbuntuSecurityUpdates: () => Promise.resolve({
    status: 'ok',
    message: 'Mocked Ubuntu ESM security updates',
    updates: []
  })
};

/**
 * Check if mocks should be used
 * Returns true when in test mode, offline mode, or USE_MOCKS is explicitly set
 */
export const shouldUseMocks = (): boolean => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NODE_ENV === 'test' || 
           process.env.USE_MOCKS === '1' ||
           process.env.VITE_OFFLINE === 'true';
  }
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    return (import.meta as any).env.VITE_USE_MOCKS === '1' ||
           (import.meta as any).env.VITE_OFFLINE === 'true';
  }
  return false;
};
