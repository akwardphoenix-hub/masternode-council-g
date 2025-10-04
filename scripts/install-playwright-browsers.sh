#!/bin/bash

# Install Playwright browsers with fallback to manual download
# This script works around Playwright download progress display bugs

set -e

echo "Installing Playwright browsers..."

# Try standard installation first
if npx playwright install chromium 2>/dev/null; then
    echo "✓ Playwright browsers installed successfully"
    exit 0
fi

# If that fails, try manual download
echo "Standard installation failed, trying manual download..."

PLAYWRIGHT_VERSION="1193"
CACHE_DIR="$HOME/.cache/ms-playwright"
CHROMIUM_DIR="$CACHE_DIR/chromium-$PLAYWRIGHT_VERSION"

mkdir -p "$CHROMIUM_DIR"

if [ ! -f "$CHROMIUM_DIR/chrome-linux/chrome" ]; then
    echo "Downloading Chromium browser manually..."
    cd "$CHROMIUM_DIR"
    
    # Download the browser
    if curl -L -o chromium.zip "https://cdn.playwright.dev/dbazure/download/playwright/builds/chromium/$PLAYWRIGHT_VERSION/chromium-linux.zip"; then
        echo "Extracting browser..."
        unzip -q chromium.zip
        rm chromium.zip
        echo "✓ Chromium browser downloaded and extracted"
    else
        echo "✗ Failed to download Chromium browser"
        exit 1
    fi
else
    echo "✓ Chromium browser already installed at $CHROMIUM_DIR"
fi

exit 0
