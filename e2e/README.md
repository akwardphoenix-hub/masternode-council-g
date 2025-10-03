# E2E Tests – Harmonizer

## Running Locally
```bash
npm run dev   # start dev server
npm run test:e2e   # run tests headless
npm run test:e2e:headed   # run tests with browser UI
```

## CI/CD

Runs automatically on every push/PR to main using GitHub Actions.

Workflow: `.github/workflows/test.yml`.

## Reports

After running locally:

```bash
npm run test:e2e:report
```

Opens the Playwright HTML report.
