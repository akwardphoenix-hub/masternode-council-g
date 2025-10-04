/**
 * Validation script for mock configuration
 * Verifies that mocks load correctly when USE_MOCKS=1
 * 
 * Run with: node --loader tsx config/mock.config.test.ts
 * Or: USE_MOCKS=1 npx tsx config/mock.config.test.ts
 */

import { shouldUseMocks, mockAPI, mockProposals, mockVotes, mockAuditLog, mockBills } from './mock.config';

let passed = 0;
let failed = 0;

function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`✅ ${message}`);
    passed++;
  } else {
    console.error(`❌ ${message}`);
    failed++;
  }
}

async function runValidation() {
  console.log('🔍 Validating Mock Configuration\n');

  // Test shouldUseMocks()
  console.log('Testing shouldUseMocks()...');
  process.env.NODE_ENV = 'test';
  assert(shouldUseMocks() === true, 'shouldUseMocks() returns true when NODE_ENV=test');
  
  process.env.NODE_ENV = 'production';
  process.env.USE_MOCKS = '1';
  assert(shouldUseMocks() === true, 'shouldUseMocks() returns true when USE_MOCKS=1');
  
  // Test Mock Data
  console.log('\nTesting Mock Data...');
  assert(Array.isArray(mockProposals), 'mockProposals is an array');
  assert(mockProposals.length > 0, 'mockProposals has data');
  assert(Array.isArray(mockVotes), 'mockVotes is an array');
  assert(Array.isArray(mockAuditLog), 'mockAuditLog is an array');
  assert(Array.isArray(mockBills), 'mockBills is an array');
  assert(mockBills.length > 0, 'mockBills has data');

  // Test Mock API
  console.log('\nTesting Mock API Methods...');
  
  const proposals = await mockAPI.getProposals();
  assert(Array.isArray(proposals), 'getProposals() returns array');
  assert(proposals === mockProposals, 'getProposals() returns mockProposals');
  
  const votes = await mockAPI.getVotes();
  assert(Array.isArray(votes), 'getVotes() returns array');
  
  const auditLog = await mockAPI.getAuditLog();
  assert(Array.isArray(auditLog), 'getAuditLog() returns array');
  
  const billData = await mockAPI.fetchBillData();
  assert(typeof billData.title === 'string', 'fetchBillData() returns bill with title');
  assert(typeof billData.sponsor === 'string', 'fetchBillData() returns bill with sponsor');
  
  const bills = await mockAPI.fetchBills();
  assert(Array.isArray(bills), 'fetchBills() returns array');
  assert(bills.length > 0, 'fetchBills() returns data');
  
  const bill = await mockAPI.fetchBillById('hr4763');
  assert(bill !== null && bill !== undefined, 'fetchBillById() returns bill');
  assert('number' in bill, 'fetchBillById() returns bill with number');
  
  const limitedBills = await mockAPI.fetchBills(1);
  assert(limitedBills.length <= 1, 'fetchBills(1) respects limit');

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('='.repeat(50));
  
  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('\n🎉 All mock configuration validations passed!');
    process.exit(0);
  }
}

runValidation().catch(err => {
  console.error('❌ Validation failed with error:', err);
  process.exit(1);
});
