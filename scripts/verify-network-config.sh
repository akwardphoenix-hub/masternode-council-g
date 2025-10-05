#!/bin/bash
# Verification script for network configuration
# Ensures the application can run offline with proper mocking

set -e

echo "🔍 Verifying Network Configuration"
echo "======================================"
echo ""

# Check if required files exist
echo "✓ Checking required files..."
FILES=(
  "src/lib/fetchSafe.ts"
  "config/mock.config.ts"
  "playwright.config.ts"
  "package.json"
  "COPILOT-ALLOWLIST.md"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file exists"
  else
    echo "  ✗ $file missing"
    exit 1
  fi
done
echo ""

# Check for proper environment variable handling
echo "✓ Checking environment variable support..."
if grep -q "USE_MOCKS" config/mock.config.ts; then
  echo "  ✓ USE_MOCKS supported in mock.config.ts"
else
  echo "  ✗ USE_MOCKS not found in mock.config.ts"
  exit 1
fi

if grep -q "NODE_ENV" config/mock.config.ts; then
  echo "  ✓ NODE_ENV supported in mock.config.ts"
else
  echo "  ✗ NODE_ENV not found in mock.config.ts"
  exit 1
fi
echo ""

# Check for GitHub domain mocking in fetchSafe.ts
echo "✓ Checking GitHub domain mocking..."
if grep -q "runtime.github.com" src/lib/fetchSafe.ts; then
  echo "  ✓ runtime.github.com mocking implemented"
else
  echo "  ✗ runtime.github.com mocking missing"
  exit 1
fi

if grep -q "models.github.ai" src/lib/fetchSafe.ts; then
  echo "  ✓ models.github.ai mocking implemented"
else
  echo "  ✗ models.github.ai mocking missing"
  exit 1
fi
echo ""

# Check for 0.0.0.0 binding support
echo "✓ Checking 0.0.0.0 binding support..."
if grep -q "0.0.0.0" package.json; then
  echo "  ✓ preview script uses 0.0.0.0"
else
  echo "  ✗ preview script doesn't use 0.0.0.0"
  exit 1
fi

if grep -q "0.0.0.0" playwright.config.ts; then
  echo "  ✓ playwright.config.ts uses 0.0.0.0"
else
  echo "  ✗ playwright.config.ts doesn't use 0.0.0.0"
  exit 1
fi
echo ""

# Check GitHub Actions workflows
echo "✓ Checking GitHub Actions workflows..."
if grep -q "USE_MOCKS.*1" .github/workflows/test.yml; then
  echo "  ✓ test.yml uses USE_MOCKS=1"
else
  echo "  ✗ test.yml missing USE_MOCKS=1"
  exit 1
fi

if grep -q "0.0.0.0" .github/workflows/e2e.yml; then
  echo "  ✓ e2e.yml uses 0.0.0.0 binding"
else
  echo "  ✗ e2e.yml missing 0.0.0.0 binding"
  exit 1
fi
echo ""

# Test build with mocks
echo "✓ Testing build with mocks..."
USE_MOCKS=1 NODE_ENV=test npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "  ✓ Build successful with USE_MOCKS=1"
else
  echo "  ✗ Build failed with USE_MOCKS=1"
  exit 1
fi

if [ -f "dist/index.html" ]; then
  echo "  ✓ dist/index.html created"
else
  echo "  ✗ dist/index.html not found"
  exit 1
fi
echo ""

echo "======================================"
echo "✅ All network configuration checks passed!"
echo ""
echo "Next steps:"
echo "1. Ensure Copilot allowlist is configured (see COPILOT-ALLOWLIST.md)"
echo "2. Run 'npm run test:e2e' to verify E2E tests work offline"
echo "3. Check GitHub Actions runs successfully with new configuration"
