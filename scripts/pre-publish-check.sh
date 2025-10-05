#!/usr/bin/env bash
set -euo pipefail
echo "Node: $(node -v)"
echo "NPM:  $(npm -v)"

echo "Installing deps..."
npm ci

echo "Type-check + build..."
npm run build

echo "Install PW browsers (chromium only)..."
npx playwright install chromium

echo "Run E2E..."
npx playwright test

echo "OK ✅"
