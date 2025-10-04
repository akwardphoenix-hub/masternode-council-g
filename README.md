# ✨ Welcome to Your Spark Template!
You've just launched your brand-new Spark Template Codespace — everything’s fired up and ready for you to explore, build, and create with Spark!

This template is your blank canvas. It comes with a minimal setup to help you get started quickly with Spark development.

🚀 What's Inside?
- A clean, minimal Spark environment
- Pre-configured for local development
- Ready to scale with your ideas
  
🧠 What Can You Do?

Right now, this is just a starting point — the perfect place to begin building and testing your Spark applications.

## 🧪 Testing

This project includes E2E testing with Playwright.

### Running Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# Run tests with list reporter (CI format)
npm run test:e2e:ci

# View test report
npm run test:e2e:report
```

### How It Works

The Playwright configuration automatically:
- Starts the Vite dev server before tests run
- Waits for the server to be ready on `http://localhost:5173`
- Runs tests across Chromium, Firefox, and WebKit browsers
- Stops the server after tests complete

In CI, the workflow will:
1. Install dependencies
2. Install Playwright browsers with system dependencies
3. Run tests (server starts automatically via `webServer` config)
4. Report results

🧹 Just Exploring?
No problem! If you were just checking things out and don’t need to keep this code:

- Simply delete your Spark.
- Everything will be cleaned up — no traces left behind.

📄 License For Spark Template Resources 

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
