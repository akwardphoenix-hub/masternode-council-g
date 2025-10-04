#!/usr/bin/env node
/**
 * Verify the allowlist.json configuration
 * This script validates the structure and content of the allowlist
 */

const fs = require('fs');
const path = require('path');

const allowlistPath = path.join(__dirname, '..', 'allowlist.json');

try {
  // Load and parse the allowlist
  const allowlist = JSON.parse(fs.readFileSync(allowlistPath, 'utf8'));
  
  console.log('✓ allowlist.json is valid JSON\n');
  
  // Validate structure
  if (!allowlist.allowedDomains) {
    throw new Error('Missing allowedDomains section');
  }
  if (!allowlist.flatList || !Array.isArray(allowlist.flatList)) {
    throw new Error('Missing or invalid flatList array');
  }
  if (!allowlist.cspDirectives) {
    throw new Error('Missing cspDirectives section');
  }
  
  console.log('✓ Structure validation passed\n');
  
  // Display summary
  console.log('=== Allowlist Summary ===\n');
  console.log(`Total domains: ${allowlist.flatList.length}\n`);
  
  console.log('Domains by category:');
  for (const [category, config] of Object.entries(allowlist.allowedDomains)) {
    const optional = config.optional ? ' (optional)' : '';
    console.log(`  ${category}${optional}: ${config.domains.length} domain(s)`);
    config.domains.forEach(domain => console.log(`    - ${domain}`));
  }
  
  console.log('\nCSP Directives:');
  for (const [directive, sources] of Object.entries(allowlist.cspDirectives)) {
    console.log(`  ${directive}: ${sources.length} source(s)`);
  }
  
  console.log('\n✓ Allowlist verification complete!');
  process.exit(0);
  
} catch (error) {
  console.error('✗ Error:', error.message);
  process.exit(1);
}
