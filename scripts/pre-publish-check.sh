#!/bin/bash

# Pre-Publish Validation Script
# This script performs comprehensive validation before publishing the application

set -e  # Exit on any error

echo "🚀 Starting Pre-Publish Validation"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step counter
STEP=1

print_step() {
    echo ""
    echo -e "${GREEN}[$STEP/10] $1${NC}"
    STEP=$((STEP+1))
}

print_error() {
    echo -e "${RED}❌ ERROR: $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  WARNING: $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Step 1: Check Node.js and npm versions
print_step "Checking Node.js and npm versions"
node --version
npm --version
print_success "Node.js and npm are installed"

# Step 2: Check if dependencies are installed
print_step "Checking dependencies"
if [ ! -d "node_modules" ]; then
    print_error "node_modules not found. Run 'npm install' first."
    exit 1
fi
print_success "Dependencies are installed"

# Step 3: Run TypeScript compilation
print_step "Running TypeScript compilation"
npm run build > /dev/null 2>&1 || {
    print_error "TypeScript compilation failed"
    exit 1
}
print_success "TypeScript compilation succeeded"

# Step 4: Check for secrets in code
print_step "Checking for secrets in code"
if grep -r "API_KEY\|SECRET\|PASSWORD" src/ --exclude-dir=node_modules --exclude="*.md" 2>/dev/null | grep -v "PLACEHOLDER"; then
    print_warning "Potential secrets found in code. Please review."
else
    print_success "No secrets found in code"
fi

# Step 5: Check for console.log statements
print_step "Checking for console.log statements"
CONSOLE_LOGS=$(grep -r "console\.log" src/ --exclude-dir=node_modules --exclude="*.md" 2>/dev/null | wc -l || echo "0")
if [ "$CONSOLE_LOGS" -gt 0 ]; then
    print_warning "Found $CONSOLE_LOGS console.log statements. Consider removing for production."
else
    print_success "No console.log statements found"
fi

# Step 6: Validate configuration files
print_step "Validating configuration files"
required_files=("package.json" "vite.config.ts" "tsconfig.json" "playwright.config.ts")
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Required file not found: $file"
        exit 1
    fi
done
print_success "All required configuration files present"

# Step 7: Check build output
print_step "Checking build artifacts"
if [ ! -d "dist" ]; then
    print_error "dist directory not found. Build may have failed."
    exit 1
fi

if [ ! -f "dist/index.html" ]; then
    print_error "dist/index.html not found. Build may have failed."
    exit 1
fi

# Check for JS and CSS files
JS_FILES=$(find dist/assets -name "*.js" 2>/dev/null | wc -l || echo "0")
CSS_FILES=$(find dist/assets -name "*.css" 2>/dev/null | wc -l || echo "0")

if [ "$JS_FILES" -eq 0 ]; then
    print_error "No JavaScript files found in dist/assets"
    exit 1
fi

if [ "$CSS_FILES" -eq 0 ]; then
    print_error "No CSS files found in dist/assets"
    exit 1
fi

print_success "Build artifacts validated ($JS_FILES JS files, $CSS_FILES CSS files)"

# Step 8: Validate HTML output
print_step "Validating HTML output"
if ! grep -q '<!doctype html>' dist/index.html; then
    print_error "HTML doctype missing in dist/index.html"
    exit 1
fi

if ! grep -q '<div id="root">' dist/index.html; then
    print_error "Root div missing in dist/index.html"
    exit 1
fi

print_success "HTML output is valid"

# Step 9: Run E2E tests
print_step "Running E2E tests"
echo "This will take a few minutes..."

if ! npm run test:e2e > test-output.log 2>&1; then
    print_error "E2E tests failed. Check test-output.log for details"
    tail -n 50 test-output.log
    exit 1
fi

print_success "All E2E tests passed"

# Step 10: Final checklist
print_step "Final production readiness checklist"

echo ""
echo "Please manually verify:"
echo "  [ ] All features work as expected"
echo "  [ ] UI/UX is polished and consistent"
echo "  [ ] No broken links or images"
echo "  [ ] Responsive design works on all devices"
echo "  [ ] Performance is acceptable"
echo "  [ ] Accessibility requirements are met"
echo "  [ ] Documentation is up to date"
echo "  [ ] CHANGELOG is updated"
echo "  [ ] Version number is bumped"
echo "  [ ] All team members have reviewed"
echo ""

# Success summary
echo ""
echo "===================================="
echo -e "${GREEN}✅ All automated checks passed!${NC}"
echo "===================================="
echo ""
echo "The application is ready for publishing. 🎉"
echo ""
echo "Next steps:"
echo "  1. Review the manual checklist above"
echo "  2. Create a git tag for the release"
echo "  3. Push to production"
echo ""

exit 0
