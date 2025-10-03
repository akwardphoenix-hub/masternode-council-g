# Pre-Publish Checklist

Use this checklist to ensure the application is ready for production deployment.

## Automated Validation

Run the automated validation script:

```bash
./scripts/pre-publish-check.sh
```

This script validates:

- [x] Node.js and npm versions are correct
- [x] Dependencies are installed
- [x] TypeScript compiles without errors
- [x] No secrets in code
- [x] No console.log statements (or minimal)
- [x] Configuration files are valid
- [x] Build artifacts exist and are correct
- [x] HTML output is valid
- [x] All E2E tests pass (50 tests)

## Manual Validation

### Code Quality

- [ ] Code has been reviewed by at least one team member
- [ ] No TODO or FIXME comments remain in production code
- [ ] All linting issues are resolved
- [ ] TypeScript types are properly defined
- [ ] No TypeScript `any` types (unless absolutely necessary)
- [ ] Error handling is comprehensive
- [ ] Edge cases are handled

### Functionality

- [ ] All features work as expected in production build
- [ ] Proposal creation works correctly
- [ ] All voting options (approve/reject/abstain) work
- [ ] Duplicate vote prevention works
- [ ] Audit log tracks all actions
- [ ] Dashboard statistics are accurate
- [ ] Data persists correctly across page reloads
- [ ] Form validation works properly
- [ ] Toast notifications display correctly

### UI/UX

- [ ] UI is polished and consistent
- [ ] All buttons and interactive elements work
- [ ] No broken links or images
- [ ] Loading states are shown appropriately
- [ ] Error states display helpful messages
- [ ] Success states provide clear feedback
- [ ] Animations are smooth (if any)
- [ ] Icons display correctly
- [ ] Typography is consistent

### Responsive Design

Test on multiple devices/viewports:

- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Large Mobile (414x896)

### Browser Compatibility

Test in multiple browsers:

- [ ] Chrome/Chromium (latest)
- [ ] Firefox (latest) - optional
- [ ] Safari (latest) - optional
- [ ] Edge (latest) - optional
- [ ] Mobile Safari - optional
- [ ] Mobile Chrome - optional

### Performance

- [ ] Page loads in < 10 seconds
- [ ] No performance warnings in browser console
- [ ] Build size is reasonable (< 500KB for main bundle)
- [ ] Images are optimized
- [ ] No unnecessary re-renders
- [ ] No memory leaks during normal usage

### Accessibility

- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG AA standards
- [ ] Alt text for images (if any)
- [ ] Proper heading hierarchy
- [ ] ARIA labels where appropriate
- [ ] Screen reader friendly

### Security

- [ ] No API keys or secrets in code
- [ ] No sensitive data exposed in console
- [ ] HTTPS ready
- [ ] No security vulnerabilities (`npm audit`)
- [ ] Content Security Policy considered
- [ ] XSS protection in place
- [ ] Input sanitization implemented

### Data & State

- [ ] Data persistence works (localStorage/sessionStorage)
- [ ] No data loss on page reload
- [ ] Proper data validation
- [ ] State management is clean
- [ ] No race conditions
- [ ] Concurrent actions handled properly

### Documentation

- [ ] README.md is up to date
- [ ] CHANGELOG is updated with new version
- [ ] API documentation (if applicable)
- [ ] User guide or help documentation
- [ ] Code comments for complex logic
- [ ] Testing documentation
- [ ] Deployment instructions

### Version Control

- [ ] All changes are committed
- [ ] Commit messages are clear and descriptive
- [ ] Branch is up to date with main
- [ ] No merge conflicts
- [ ] Version number is bumped (package.json)
- [ ] Git tag is created for release
- [ ] CHANGELOG matches git history

### Testing

- [ ] All E2E tests pass (50/50)
- [ ] Manual testing completed
- [ ] Smoke tests performed
- [ ] Regression testing done
- [ ] Test coverage is adequate
- [ ] No flaky tests
- [ ] Tests run successfully in CI/CD

### Build & Deployment

- [ ] Production build completes successfully
- [ ] Build artifacts are valid
- [ ] index.html is correct
- [ ] Assets are bundled correctly
- [ ] Source maps are generated (or excluded for production)
- [ ] Environment variables are configured
- [ ] Deployment pipeline is tested
- [ ] Rollback plan is ready

### Monitoring & Logging

- [ ] Error tracking is set up (if applicable)
- [ ] Analytics are configured (if applicable)
- [ ] Performance monitoring (if applicable)
- [ ] Console logs are removed or gated
- [ ] Logging strategy is implemented

### Legal & Compliance

- [ ] License file is present and correct
- [ ] Third-party licenses are documented
- [ ] Privacy policy (if collecting data)
- [ ] Terms of service (if applicable)
- [ ] GDPR compliance (if applicable)
- [ ] Accessibility compliance (ADA, WCAG)

### Team Sign-off

- [ ] Product owner approves
- [ ] Technical lead approves
- [ ] QA team approves
- [ ] Design team approves (if applicable)
- [ ] Security review passed (if required)
- [ ] Stakeholders notified

## Pre-Deployment Steps

1. **Create Release Branch**
   ```bash
   git checkout -b release/v1.0.0
   ```

2. **Update Version**
   ```bash
   npm version patch  # or minor, major
   ```

3. **Update CHANGELOG**
   - Document all changes
   - Include breaking changes
   - Credit contributors

4. **Final Testing**
   ```bash
   npm run build
   npm run test:e2e
   ./scripts/pre-publish-check.sh
   ```

5. **Commit and Tag**
   ```bash
   git add .
   git commit -m "Release v1.0.0"
   git tag v1.0.0
   ```

6. **Merge to Main**
   ```bash
   git checkout main
   git merge release/v1.0.0
   git push origin main --tags
   ```

## Post-Deployment Steps

- [ ] Verify deployment is live
- [ ] Smoke test production environment
- [ ] Monitor error logs for 24 hours
- [ ] Check analytics for any issues
- [ ] Notify stakeholders of successful deployment
- [ ] Update documentation with any new links
- [ ] Archive release branch
- [ ] Celebrate! 🎉

## Emergency Rollback

If critical issues are found:

1. **Immediate Action**
   ```bash
   # Rollback to previous version
   git checkout v0.9.9
   # Deploy previous version
   ```

2. **Document Issue**
   - What went wrong
   - Impact assessment
   - Root cause
   - Prevention plan

3. **Fix and Redeploy**
   - Create hotfix branch
   - Fix the issue
   - Test thoroughly
   - Deploy again

## Quick Reference

### Run All Validations

```bash
# Automated validation
./scripts/pre-publish-check.sh

# Manual testing
npm run build
npm run preview  # Test in browser
npm run test:e2e
```

### Common Issues

**Build fails**
- Check TypeScript errors: `npm run build`
- Check dependencies: `npm install`

**Tests fail**
- Run in UI mode: `npm run test:e2e:ui`
- Check logs: `playwright-report/`

**Performance issues**
- Check bundle size: `ls -lh dist/assets/`
- Analyze build: `npm run build -- --mode production`

## Resources

- [TESTING.md](./TESTING.md) - Testing guide
- [TEST-SUMMARY.md](./TEST-SUMMARY.md) - Test coverage
- [README.md](./README.md) - Project overview
- [GitHub Actions](https://github.com/akwardphoenix-hub/masternode-council-g/actions) - CI/CD status

## Notes

- This checklist should be updated as new requirements emerge
- Not all items may apply to every release
- Use judgment to determine what's critical for your deployment
- Document any deviations from this checklist

---

**Remember**: It's better to delay a release than to deploy broken code to production. Take your time and be thorough! ✅
