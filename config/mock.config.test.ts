/**
 * Unit tests for mock configuration
 * Verifies that mocks load correctly when USE_MOCKS=1
 */

import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { shouldUseMocks, mockAPI, mockProposals, mockVotes, mockAuditLog, mockBills } from './mock.config';

describe('Mock Configuration', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('shouldUseMocks()', () => {
    it('should return true when NODE_ENV is test', () => {
      process.env.NODE_ENV = 'test';
      expect(shouldUseMocks()).toBe(true);
    });

    it('should return true when USE_MOCKS is 1', () => {
      process.env.USE_MOCKS = '1';
      expect(shouldUseMocks()).toBe(true);
    });

    it('should return false when neither condition is met', () => {
      process.env.NODE_ENV = 'production';
      process.env.USE_MOCKS = '0';
      expect(shouldUseMocks()).toBe(false);
    });
  });

  describe('Mock Data', () => {
    it('should have mock proposals', () => {
      expect(mockProposals).toBeDefined();
      expect(Array.isArray(mockProposals)).toBe(true);
      expect(mockProposals.length).toBeGreaterThan(0);
    });

    it('should have mock votes array', () => {
      expect(mockVotes).toBeDefined();
      expect(Array.isArray(mockVotes)).toBe(true);
    });

    it('should have mock audit log array', () => {
      expect(mockAuditLog).toBeDefined();
      expect(Array.isArray(mockAuditLog)).toBe(true);
    });

    it('should have mock bills', () => {
      expect(mockBills).toBeDefined();
      expect(Array.isArray(mockBills)).toBe(true);
      expect(mockBills.length).toBeGreaterThan(0);
    });
  });

  describe('Mock API', () => {
    it('should provide getProposals method', async () => {
      const proposals = await mockAPI.getProposals();
      expect(Array.isArray(proposals)).toBe(true);
      expect(proposals).toEqual(mockProposals);
    });

    it('should provide getVotes method', async () => {
      const votes = await mockAPI.getVotes();
      expect(Array.isArray(votes)).toBe(true);
      expect(votes).toEqual(mockVotes);
    });

    it('should provide getAuditLog method', async () => {
      const auditLog = await mockAPI.getAuditLog();
      expect(Array.isArray(auditLog)).toBe(true);
      expect(auditLog).toEqual(mockAuditLog);
    });

    it('should provide fetchBillData method', async () => {
      const billData = await mockAPI.fetchBillData();
      expect(billData).toBeDefined();
      expect(billData).toHaveProperty('title');
      expect(billData).toHaveProperty('sponsor');
      expect(billData).toHaveProperty('introducedDate');
      expect(billData).toHaveProperty('latestAction');
    });

    it('should provide fetchBills method', async () => {
      const bills = await mockAPI.fetchBills();
      expect(Array.isArray(bills)).toBe(true);
      expect(bills.length).toBeGreaterThan(0);
    });

    it('should provide fetchBillById method', async () => {
      const bill = await mockAPI.fetchBillById('hr4763');
      expect(bill).toBeDefined();
      expect(bill).toHaveProperty('number');
      expect(bill).toHaveProperty('title');
    });

    it('should limit results in fetchBills', async () => {
      const limit = 1;
      const bills = await mockAPI.fetchBills(limit);
      expect(bills.length).toBeLessThanOrEqual(limit);
    });
  });
});
