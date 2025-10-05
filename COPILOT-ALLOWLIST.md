# GitHub Copilot Allowlist Configuration

## Required Repository Settings

To enable proper functionality of GitHub Copilot agents in this repository, the following domains need to be added to the Copilot allowlist in the repository settings.

### Domains to Allowlist

1. **runtime.github.com** - GitHub Runtime API for Copilot execution
2. **models.github.ai** - GitHub AI Models API for Copilot features

### How to Configure (Repository Admin Required)

1. Navigate to repository **Settings**
2. Go to **Code security and analysis** or **Copilot** section
3. Find **Copilot network allowlist** settings
4. Add the following domains:
   - `runtime.github.com`
   - `models.github.ai`
5. Save the configuration

### Why These Domains Are Needed

- **runtime.github.com**: Provides runtime execution environment for GitHub Copilot agents
- **models.github.ai**: Enables access to GitHub's AI models for code suggestions and completions

### Fallback Behavior

When these domains are blocked or unavailable:
- In `NODE_ENV=test` or `USE_MOCKS=1` mode, the application will automatically return mock responses
- External network calls are blocked in test/CI environments
- Mock implementations are provided in `config/mock.config.ts`
- The `fetchSafe.ts` utility handles graceful degradation

### Testing Without External Access

To verify the application works without external network access:

```bash
# Build with mocks enabled
USE_MOCKS=1 NODE_ENV=test npm run build

# Run E2E tests offline
USE_MOCKS=1 NODE_ENV=test npm run test:e2e
```

All tests should pass without requiring external network connectivity to the GitHub domains.

## Related Files

- `src/lib/fetchSafe.ts` - Safe fetch wrapper with mock support
- `config/mock.config.ts` - Mock data and API responses
- `playwright.config.ts` - Test configuration with mock environment
- `.github/workflows/*.yml` - CI/CD workflows with mock flags

## Verification

After configuring the allowlist, verify proper functionality by:

1. Running Copilot agent commands in the repository
2. Checking that Copilot features work without firewall blocks
3. Ensuring CI/CD pipelines complete successfully

For offline/firewall-restricted environments, see `OFFLINE-TESTING.md` for complete testing instructions.
