# Contributing to Masternode Council Governance App

Thank you for your interest in contributing to the Masternode Council Governance App! This document provides guidelines and standards for contributing to this project.

## 🤝 How to Contribute

### Reporting Issues

- Use GitHub Issues to report bugs or request features
- Search existing issues before creating a new one
- Provide detailed information including steps to reproduce for bugs
- Include relevant system information (OS, Node version, browser)

### Submitting Changes

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Write or update tests** to cover your changes
4. **Run the full test suite** to ensure nothing breaks
5. **Update documentation** as needed
6. **Submit a pull request** with a clear description

## 📋 Pull Request Process

### Before Submitting

1. Ensure your code follows the project's coding standards
2. Run linting: `npm run lint`
3. Run tests: `npm run test:e2e`
4. Build successfully: `npm run build`
5. Update relevant documentation

### PR Requirements

- **Clear title** describing the change
- **Detailed description** of what and why
- **Reference related issues** using `Fixes #123` or `Relates to #456`
- **Keep changes focused** - one feature/fix per PR
- **Add tests** for new functionality
- **Update documentation** if changing APIs or features

### Review Process

- Maintainers will review your PR
- Address feedback promptly
- Keep your PR up to date with `main` branch
- CI checks must pass before merging

## 💻 Coding Standards

### TypeScript/React Guidelines

- Use **functional components** with React hooks
- **Type all props** with TypeScript interfaces
- Keep components **small and focused**
- Use **descriptive variable names**
- Avoid unnecessary comments - write self-documenting code
- Follow existing patterns in the codebase

### File Organization

```
src/
├── components/       # Reusable UI components
│   └── ui/          # shadcn/ui components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
└── App.tsx          # Main application
```

### Code Style

- Use **2 spaces** for indentation
- Use **single quotes** for strings (unless JSX)
- Use **semicolons** at statement ends
- Keep lines under **100 characters** when reasonable
- Run `npm run format` before committing

### Component Guidelines

1. **Props interfaces** should be defined above the component
2. **State management** should be minimal and focused
3. **Effects** should have appropriate dependencies
4. **Event handlers** should be descriptive (e.g., `handleSubmit`, `handleVoteClick`)
5. **Accessibility** - include ARIA labels, roles, and keyboard support

### Testing Guidelines

- Write **E2E tests** for user workflows
- Test **happy paths** and **error cases**
- Use **meaningful test descriptions**
- Keep tests **isolated and independent**
- Mock external dependencies appropriately

Example test structure:
```typescript
test('should submit proposal successfully', async ({ page }) => {
  await page.goto('/')
  await page.click('[data-testid="new-proposal-button"]')
  await page.fill('[data-testid="proposal-title"]', 'Test Proposal')
  await page.fill('[data-testid="proposal-description"]', 'Description')
  await page.click('[data-testid="submit-button"]')
  await expect(page.locator('[data-testid="proposal-card"]')).toBeVisible()
})
```

## 🧪 Testing Requirements

### Running Tests

```bash
# Install dependencies (one-time)
npm install
npx playwright install chromium

# Run all E2E tests (offline with mocks)
USE_MOCKS=1 npm run test:e2e

# Run tests with UI (debugging)
USE_MOCKS=1 npm run test:e2e:ui

# Run specific test file
npx playwright test e2e/proposals.spec.ts
```

### Test Coverage

- All new features must include tests
- Critical user flows must be tested end-to-end
- Edge cases should be covered
- Error states should be tested

## 🔒 Security

- **Never commit** secrets, API keys, or credentials
- **Report security issues** privately via email (see SECURITY.md)
- Follow **secure coding practices**
- Validate and sanitize user input
- Use TypeScript for type safety

## 📝 Commit Messages

Write clear, descriptive commit messages:

```
feat: add vote filtering functionality
fix: prevent duplicate votes on same proposal
docs: update README with deployment instructions
test: add E2E tests for audit log
refactor: simplify proposal card component
chore: update dependencies
```

### Commit Message Format

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **test**: Adding or updating tests
- **refactor**: Code refactoring
- **style**: Code style changes (formatting, etc.)
- **chore**: Maintenance tasks

## 🎨 UI/UX Guidelines

- Follow **Tailwind CSS** conventions
- Use **shadcn/ui components** for consistency
- Maintain **responsive design** (mobile, tablet, desktop)
- Ensure **accessibility** (WCAG 2.1 AA compliance)
- Provide **clear user feedback** (loading states, errors, success messages)
- Keep the interface **clean and professional**

## 📚 Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for complex functions
- Update PRD.md if changing requirements
- Keep TESTING.md current with test changes
- Document architectural decisions

## ⚖️ Governance Principles

This project follows **Harmonic Math** principles:
- **1 = Self**: Individual contributions matter
- **2 = Other**: Collaborative review process
- **3 = We**: Community-driven development
- **4 = Council**: Structured decision-making

### Decision Making

- **Minor changes**: Direct PR to maintainers
- **Major changes**: Open issue for discussion first
- **Breaking changes**: Require consensus and migration plan

## 🚫 Code of Conduct

Please review and follow our [Code of Conduct](CODE_OF_CONDUCT.md). We are committed to providing a welcoming and inclusive environment.

## ❓ Questions?

- Open a discussion on GitHub
- Check existing documentation
- Review closed issues for similar questions

## 📜 License

By contributing, you agree that your contributions will be licensed under the same MIT License that covers this project.

---

Thank you for contributing to Masternode Council Governance App! 🙏
