#!/bin/bash

# Script to install Playwright browsers
# This script handles the Playwright browser installation with a workaround for download issues

set -e

echo "=========================================="
echo "Installing Playwright Browsers"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Install system dependencies
echo "Step 1: Installing system dependencies..."
if npx playwright install-deps chromium > /dev/null 2>&1; then
    echo -e "${GREEN}✓ System dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠ Could not install all dependencies (this may be OK)${NC}"
fi
echo ""

# Try installing browsers directly
echo "Step 2: Installing Playwright browsers..."
if npx playwright install chromium 2>&1 | grep -q "Chromium.*downloaded"; then
    echo -e "${GREEN}✓ Playwright browsers installed successfully${NC}"
    exit 0
fi

# If that fails, try manual download approach
echo -e "${YELLOW}⚠ Standard installation had issues, trying manual download...${NC}"
echo ""

# Get Playwright version
PLAYWRIGHT_VERSION=$(node -p "require('@playwright/test/package.json').version")
echo "Detected Playwright version: $PLAYWRIGHT_VERSION"

# Determine build number (this may need adjustment for different versions)
BUILD_NUMBER="1193"
echo "Using build number: $BUILD_NUMBER"

# Create cache directory
mkdir -p ~/.cache/ms-playwright

# Download Chromium
echo "Downloading Chromium browser..."
cd /tmp
rm -f chromium.zip

if curl -L "https://playwright.azureedge.net/builds/chromium/${BUILD_NUMBER}/chromium-linux.zip" \
    -o chromium.zip --progress-bar --fail; then
    
    echo "Extracting Chromium..."
    unzip -q chromium.zip
    
    # Move to proper location
    rm -rf ~/.cache/ms-playwright/chromium-${BUILD_NUMBER}
    mkdir -p ~/.cache/ms-playwright/chromium-${BUILD_NUMBER}/
    mv chrome-linux ~/.cache/ms-playwright/chromium-${BUILD_NUMBER}/
    
    # Create headless shell symlink (newer Playwright versions need this)
    mkdir -p ~/.cache/ms-playwright/chromium_headless_shell-${BUILD_NUMBER}/chrome-linux
    cd ~/.cache/ms-playwright/chromium_headless_shell-${BUILD_NUMBER}/chrome-linux
    ln -sf ../../chromium-${BUILD_NUMBER}/chrome-linux/chrome headless_shell
    
    echo -e "${GREEN}✓ Chromium installed successfully${NC}"
    echo ""
    echo "Browser installed at: ~/.cache/ms-playwright/chromium-${BUILD_NUMBER}/"
    echo ""
    echo "You can now run tests with: npm run test:e2e"
else
    echo -e "${RED}✗ Failed to download Chromium${NC}"
    echo ""
    echo "Please try:"
    echo "  1. Check your internet connection"
    echo "  2. Run: npx playwright install chromium --with-deps"
    echo "  3. Or install system chromium: sudo apt-get install chromium-browser"
    exit 1
fi
