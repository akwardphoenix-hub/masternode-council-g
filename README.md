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

This project includes a comprehensive E2E testing suite powered by Playwright:

- **66 test cases** across **7 test suites**
- Automated testing in CI/CD via GitHub Actions
- Tests cover: app loading, proposals, voting, audit trail, dashboard stats, workflows, and production builds

### Running Tests

```bash
# Start the dev server first
npm run dev

# In another terminal, run tests
npm run test:e2e              # Run all tests (headless)
npm run test:e2e:headed       # Run tests with browser UI
npm run test:e2e:report       # View HTML test report
npm run test:e2e:ci           # Run tests in CI mode
```

For more details, see [TESTING.md](./TESTING.md) and [e2e/README.md](./e2e/README.md).

🧹 Just Exploring?
No problem! If you were just checking things out and don’t need to keep this code:

- Simply delete your Spark.
- Everything will be cleaned up — no traces left behind.

📄 License For Spark Template Resources 

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
