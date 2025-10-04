#!/bin/bash

# Pre-publish validation script for Masternode Council App
# This script runs comprehensive checks before publishing

set -e

echo "=================================="
echo "Pre-Publish Validation Starting..."
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track overall status
ERRORS=0

echo "Step 1: Checking Node.js and npm versions..."
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
echo "✓ Node.js: $NODE_VERSION"
echo "✓ npm: $NPM_VERSION"
echo ""

echo "Step 2: Installing dependencies..."
if npm ci --silent; then
    echo -e "${GREEN}✓ Dependencies installed successfully${NC}"
else
    echo -e "${RED}✗ Failed to install dependencies${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

echo "Step 3: Running TypeScript type checking..."
if npm run build > /tmp/build.log 2>&1; then
    echo -e "${GREEN}✓ TypeScript compilation successful${NC}"
    echo "  Build output size:"
    du -sh dist/ | awk '{print "  " $1}'
else
    echo -e "${RED}✗ TypeScript compilation failed${NC}"
    tail -n 20 /tmp/build.log
    ERRORS=$((ERRORS + 1))
fi
echo ""

echo "Step 4: Checking for common security issues..."
if [ -f ".env" ]; then
    if grep -q "API_KEY.*=.*[a-zA-Z0-9]" .env 2>/dev/null; then
        echo -e "${YELLOW}⚠ Warning: .env file contains API keys (ensure it's in .gitignore)${NC}"
    fi
fi

if grep -r "console.log" src/ --include="*.tsx" --include="*.ts" | grep -v "// console.log" > /tmp/console.log 2>&1; then
    echo -e "${YELLOW}⚠ Warning: Found console.log statements in source code${NC}"
    echo "  Consider removing for production:"
    head -n 5 /tmp/console.log | awk '{print "  " $0}'
else
    echo -e "${GREEN}✓ No console.log statements found${NC}"
fi
echo ""

echo "Step 5: Checking .gitignore configuration..."
if [ -f ".gitignore" ]; then
    if grep -q "node_modules" .gitignore && grep -q "dist" .gitignore; then
        echo -e "${GREEN}✓ .gitignore properly configured${NC}"
    else
        echo -e "${YELLOW}⚠ .gitignore may be missing important entries${NC}"
    fi
else
    echo -e "${RED}✗ .gitignore file not found${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

echo "Step 6: Checking package.json configuration..."
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓ package.json exists${NC}"
    
    # Check for required fields
    if grep -q '"name"' package.json && grep -q '"version"' package.json; then
        echo -e "${GREEN}✓ Required package.json fields present${NC}"
    else
        echo -e "${RED}✗ Missing required package.json fields${NC}"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}✗ package.json not found${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

echo "Step 7: Checking build artifacts..."
if [ -d "dist" ]; then
    FILE_COUNT=$(find dist -type f | wc -l)
    echo -e "${GREEN}✓ Build artifacts created ($FILE_COUNT files)${NC}"
    
    # Check for index.html
    if [ -f "dist/index.html" ]; then
        echo -e "${GREEN}✓ index.html present in dist${NC}"
    else
        echo -e "${RED}✗ index.html missing from dist${NC}"
        ERRORS=$((ERRORS + 1))
    fi
    
    # Check for JS bundles
    if ls dist/assets/*.js > /dev/null 2>&1; then
        echo -e "${GREEN}✓ JavaScript bundles present${NC}"
    else
        echo -e "${RED}✗ JavaScript bundles missing${NC}"
        ERRORS=$((ERRORS + 1))
    fi
    
    # Check for CSS
    if ls dist/assets/*.css > /dev/null 2>&1; then
        echo -e "${GREEN}✓ CSS files present${NC}"
    else
        echo -e "${YELLOW}⚠ No CSS files found in build${NC}"
    fi
else
    echo -e "${RED}✗ dist directory not found${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

echo "Step 8: Validating HTML output..."
if [ -f "dist/index.html" ]; then
    if grep -q "<!doctype html>" dist/index.html || grep -q "<!DOCTYPE html>" dist/index.html; then
        echo -e "${GREEN}✓ Valid HTML doctype${NC}"
    else
        echo -e "${YELLOW}⚠ HTML doctype may be missing${NC}"
    fi
    
    if grep -q "<script" dist/index.html; then
        echo -e "${GREEN}✓ JavaScript references present${NC}"
    else
        echo -e "${RED}✗ No JavaScript references found${NC}"
        ERRORS=$((ERRORS + 1))
    fi
fi
echo ""

echo "Step 9: Checking mock data files..."
if [ -d "dist/mocks" ]; then
    echo -e "${GREEN}✓ Mock data directory present in dist${NC}"
    
    if [ -f "dist/mocks/proposals.json" ] && [ -f "dist/mocks/votes.json" ] && [ -f "dist/mocks/audit.json" ]; then
        echo -e "${GREEN}✓ All mock data files present${NC}"
    else
        echo -e "${YELLOW}⚠ Some mock data files missing${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Mock data directory not found in dist${NC}"
fi

if [ -f "config/mock.config.ts" ]; then
    echo -e "${GREEN}✓ Mock configuration file present${NC}"
else
    echo -e "${YELLOW}⚠ Mock configuration file missing${NC}"
fi
echo ""

echo "Step 10: Running end-to-end tests..."
# Check if Playwright browsers are installed
if [ -d "$HOME/.cache/ms-playwright/chromium_headless_shell"* ] || [ -d "$HOME/.cache/ms-playwright/chromium-"* ]; then
    echo -e "${GREEN}✓ Playwright browsers found${NC}"
    
    if USE_MOCKS=1 npm run test:ci > /tmp/e2e-tests.log 2>&1; then
        echo -e "${GREEN}✓ All E2E tests passed (offline mode)${NC}"
        
        # Show test summary
        if grep -E "passed|failed" /tmp/e2e-tests.log | tail -5; then
            echo ""
        fi
    else
        echo -e "${RED}✗ E2E tests failed${NC}"
        echo "Last 30 lines of test output:"
        tail -n 30 /tmp/e2e-tests.log
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${YELLOW}⚠ Playwright browsers not installed (tests skipped)${NC}"
    echo "  Install with: npx playwright install chromium"
    echo "  Then run: USE_MOCKS=1 npm run test:e2e"
fi
echo ""

echo "Step 11: Final checklist..."
echo "  • README.md present: $([ -f README.md ] && echo '✓' || echo '✗')"
echo "  • LICENSE present: $([ -f LICENSE ] && echo '✓' || echo '✗')"
echo "  • package.json present: $([ -f package.json ] && echo '✓' || echo '✗')"
echo "  • Source files present: $([ -d src ] && echo '✓' || echo '✗')"
echo "  • Build output present: $([ -d dist ] && echo '✓' || echo '✗')"
echo ""

echo "=================================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ Pre-publish validation PASSED${NC}"
    echo "=================================="
    echo ""
    echo "Your app is ready for publishing! 🚀"
    exit 0
else
    echo -e "${RED}✗ Pre-publish validation FAILED${NC}"
    echo "  Found $ERRORS error(s)"
    echo "=================================="
    echo ""
    echo "Please fix the errors above before publishing."
    exit 1
fi
