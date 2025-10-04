# Testing Instructions

These instructions apply when creating or modifying tests for the Masternode Council Governance System.

## Testing Philosophy

### Brave Codex Testing Principles
- **Repair-First**: Tests should validate that the system gracefully handles errors and repairs state
- **Audit Integrity**: Every test that modifies state should verify audit log entries are created
- **Harmonic Balance**: Test that the system maintains balance (e.g., vote counts, node consensus)
- **Transparency**: Test output should be clear and descriptive

## Test Structure

### File Organization
- Place unit tests next to the component/module: `ComponentName.test.tsx`
- Place integration tests in `src/__tests__/integration/`
- Place end-to-end tests in `src/__tests__/e2e/`
- Use `.test.tsx` extension for TypeScript test files
- Use `.test.jsx` extension for JavaScript test files

### Naming Conventions
```typescript
describe('ProposalCard', () => {
  describe('rendering', () => {
    it('should display proposal title and author', () => {
      // test implementation
    });
    
    it('should show correct status badge variant', () => {
      // test implementation
    });
  });
  
  describe('voting', () => {
    it('should call onVote when approve button is clicked', () => {
      // test implementation
    });
    
    it('should disable voting buttons after user has voted', () => {
      // test implementation
    });
  });
  
  describe('audit logging', () => {
    it('should create audit entry when vote is cast', () => {
      // test implementation
    });
  });
});
```

## Testing Framework

### Setup
- Use **Vitest** as the test runner (configured in `vite.config.ts`)
- Use **React Testing Library** for component tests
- Use **MSW (Mock Service Worker)** for API mocking if needed

### Common Imports
```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
```

## Component Testing Patterns

### Basic Component Test
```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProposalCard from './ProposalCard';

describe('ProposalCard', () => {
  const mockProposal = {
    id: '1',
    title: 'Test Proposal',
    description: 'Test description',
    author: 'TestNode',
    status: 'pending',
    createdAt: '2024-01-01T00:00:00Z'
  };

  it('should render proposal details', () => {
    render(<ProposalCard proposal={mockProposal} />);
    
    expect(screen.getByText('Test Proposal')).toBeInTheDocument();
    expect(screen.getByText(/TestNode/)).toBeInTheDocument();
    expect(screen.getByText('pending')).toBeInTheDocument();
  });
});
```

### Testing User Interactions
```typescript
import userEvent from '@testing-library/user-event';

it('should call onVote when approve button is clicked', async () => {
  const user = userEvent.setup();
  const mockOnVote = vi.fn();
  
  render(
    <ProposalCard 
      proposal={mockProposal} 
      onVote={mockOnVote} 
    />
  );
  
  const approveButton = screen.getByRole('button', { name: /approve/i });
  await user.click(approveButton);
  
  expect(mockOnVote).toHaveBeenCalledWith('1', 'approve');
});
```

### Testing Async Operations
```typescript
it('should display loading state while fetching proposals', async () => {
  render(<Dashboard />);
  
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
  
  expect(screen.getByText(/proposals/i)).toBeInTheDocument();
});
```

### Testing State Changes
```typescript
it('should disable voting buttons after vote is cast', async () => {
  const user = userEvent.setup();
  
  render(<ProposalCard proposal={mockProposal} onVote={vi.fn()} />);
  
  const approveButton = screen.getByRole('button', { name: /approve/i });
  await user.click(approveButton);
  
  expect(approveButton).toBeDisabled();
  expect(screen.getByRole('button', { name: /reject/i })).toBeDisabled();
});
```

## Masternode Council Specific Tests

### Testing Proposals
```typescript
describe('Proposal submission', () => {
  it('should create proposal with all required fields', () => {
    const proposal = createProposal({
      title: 'Test',
      description: 'Description',
      author: 'Node1'
    });
    
    expect(proposal).toHaveProperty('id');
    expect(proposal).toHaveProperty('title', 'Test');
    expect(proposal).toHaveProperty('description', 'Description');
    expect(proposal).toHaveProperty('author', 'Node1');
    expect(proposal).toHaveProperty('status', 'pending');
    expect(proposal).toHaveProperty('createdAt');
  });
  
  it('should create audit entry when proposal is submitted', () => {
    const { auditLog } = submitProposal(mockProposal);
    
    expect(auditLog).toHaveLength(1);
    expect(auditLog[0]).toMatchObject({
      action: 'Proposal submitted',
      actor: mockProposal.author,
      timestamp: expect.any(String)
    });
  });
});
```

### Testing Votes
```typescript
describe('Voting system', () => {
  it('should record vote with all required fields', () => {
    const vote = castVote('proposal-1', 'approve', 'Node1');
    
    expect(vote).toMatchObject({
      proposalId: 'proposal-1',
      voter: 'Node1',
      vote: 'approve',
      timestamp: expect.any(String)
    });
  });
  
  it('should prevent duplicate votes from same node', () => {
    castVote('proposal-1', 'approve', 'Node1');
    
    expect(() => {
      castVote('proposal-1', 'reject', 'Node1');
    }).toThrow('Node has already voted');
  });
  
  it('should accept abstain votes and log them', () => {
    const result = castVote('proposal-1', 'abstain', 'Node1');
    
    expect(result.vote).toBe('abstain');
    expect(result.auditEntry).toMatchObject({
      action: 'Vote cast',
      actor: 'Node1',
      details: expect.stringContaining('abstain')
    });
  });
});
```

### Testing Audit Trail
```typescript
describe('Audit logging', () => {
  it('should create audit entry with required fields', () => {
    const entry = createAuditEntry({
      action: 'Test action',
      actor: 'TestNode'
    });
    
    expect(entry).toHaveProperty('id');
    expect(entry).toHaveProperty('timestamp');
    expect(entry).toHaveProperty('action', 'Test action');
    expect(entry).toHaveProperty('actor', 'TestNode');
  });
  
  it('should log all state-changing operations', () => {
    const auditLog = [];
    const addAuditEntry = (entry) => auditLog.push(entry);
    
    // Perform various operations
    submitProposal({ addAuditEntry });
    castVote({ addAuditEntry });
    updateProposalStatus({ addAuditEntry });
    
    expect(auditLog.length).toBeGreaterThanOrEqual(3);
  });
  
  it('should include details field for complex operations', () => {
    const entry = createAuditEntry({
      action: 'Proposal status changed',
      actor: 'MasterNode',
      details: JSON.stringify({ from: 'pending', to: 'approved' })
    });
    
    expect(entry.details).toBeDefined();
    expect(JSON.parse(entry.details)).toMatchObject({
      from: 'pending',
      to: 'approved'
    });
  });
});
```

### Testing Harmonic Balance
```typescript
describe('Node balance and consensus', () => {
  it('should calculate vote distribution correctly', () => {
    const votes = [
      { vote: 'approve' },
      { vote: 'approve' },
      { vote: 'reject' },
      { vote: 'abstain' }
    ];
    
    const distribution = calculateVoteDistribution(votes);
    
    expect(distribution).toEqual({
      approve: 2,
      reject: 1,
      abstain: 1
    });
  });
  
  it('should determine proposal outcome based on majority', () => {
    const votes = [
      { vote: 'approve' },
      { vote: 'approve' },
      { vote: 'approve' },
      { vote: 'reject' }
    ];
    
    const outcome = determineOutcome(votes);
    expect(outcome).toBe('approved');
  });
  
  it('should handle tie situations gracefully', () => {
    const votes = [
      { vote: 'approve' },
      { vote: 'reject' }
    ];
    
    const outcome = determineOutcome(votes);
    expect(outcome).toBe('pending'); // Tie defaults to pending
  });
});
```

## Testing Edge Cases

### Data Validation
```typescript
describe('Edge cases', () => {
  it('should handle missing proposal fields gracefully', () => {
    const invalidProposal = { title: 'Test' }; // missing required fields
    
    render(<ProposalCard proposal={invalidProposal} />);
    
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.queryByText('undefined')).not.toBeInTheDocument();
  });
  
  it('should format invalid dates as "Invalid Date"', () => {
    const proposal = { ...mockProposal, createdAt: 'invalid-date' };
    
    render(<ProposalCard proposal={proposal} />);
    
    expect(screen.getByText(/Invalid Date/i)).toBeInTheDocument();
  });
  
  it('should handle empty arrays gracefully', () => {
    render(<Dashboard proposals={[]} />);
    
    expect(screen.getByText(/no proposals/i)).toBeInTheDocument();
  });
});
```

### Error Handling
```typescript
describe('Error handling', () => {
  it('should display error message when operation fails', async () => {
    const mockSubmit = vi.fn().mockRejectedValue(new Error('Network error'));
    
    render(<ProposalForm onSubmit={mockSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await userEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
  
  it('should continue functioning after error', async () => {
    // First attempt fails
    const mockSubmit = vi.fn()
      .mockRejectedValueOnce(new Error('Error'))
      .mockResolvedValueOnce({ success: true });
    
    render(<ProposalForm onSubmit={mockSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    // First click fails
    await userEvent.click(submitButton);
    await waitFor(() => expect(screen.getByText(/error/i)).toBeInTheDocument());
    
    // Second click succeeds
    await userEvent.click(submitButton);
    await waitFor(() => expect(screen.getByText(/success/i)).toBeInTheDocument());
  });
});
```

## Mock Data Helpers

### Create Test Fixtures
```typescript
// test-utils/fixtures.ts
export const createMockProposal = (overrides = {}) => ({
  id: Date.now().toString(),
  title: 'Test Proposal',
  description: 'Test description',
  author: 'TestNode',
  status: 'pending',
  createdAt: new Date().toISOString(),
  ...overrides
});

export const createMockVote = (overrides = {}) => ({
  proposalId: '1',
  voter: 'Node1',
  vote: 'approve',
  timestamp: new Date().toISOString(),
  ...overrides
});

export const createMockAuditEntry = (overrides = {}) => ({
  id: Date.now().toString(),
  timestamp: new Date().toISOString(),
  action: 'Test action',
  actor: 'TestActor',
  ...overrides
});
```

## Test Coverage Guidelines

### Minimum Coverage
- Components: ≥90% coverage for user interactions and state changes
- Services: ≥85% coverage for public methods and error cases
- Utilities: ≥80% coverage for input/output variations

### Priority Testing Areas
1. **Critical paths**: Proposal submission, voting, audit logging
2. **State management**: Proper state updates and persistence
3. **User interactions**: Buttons, forms, navigation
4. **Error handling**: Network failures, validation errors
5. **Edge cases**: Empty states, invalid data, concurrent operations

## Running Tests

### Commands
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test ProposalCard.test.tsx
```

### CI/CD Integration
- Tests should run on every commit
- All tests must pass before merging
- Maintain minimum 80% code coverage for critical paths

## Related Documentation
- See `react-components.instructions.md` for component implementation details
- See `BRAVE_CODEX.md` for the system's philosophical foundation
