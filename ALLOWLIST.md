# Domain Allowlist Configuration

This document describes the allowlist of external domains used by the Masternode Council application.

## Purpose

The `allowlist.json` file contains a comprehensive list of external domains that the application is permitted to communicate with. This serves multiple purposes:

1. **Security**: Document trusted external resources
2. **Compliance**: Track third-party integrations
3. **Development**: Configure Content Security Policy (CSP)
4. **Testing**: Configure browser testing environments

## Allowed Domains

### Google Services (Authentication & Chromium)
- `accounts.google.com` - Google OAuth authentication
- `android.clients.google.com` - Android Chromium components
- `clients2.google.com` - Google API clients
- `www.google.com` - General Google services

**Purpose**: Google authentication and Chromium browser functionality

### Google CDN
- `redirector.gvt1.com` - Chrome binary CDN

**Purpose**: Chrome browser updates and binary downloads

### Font Services
- `fonts.googleapis.com` - Google Fonts API
- `fonts.gstatic.com` - Google Fonts static resources

**Purpose**: Loading the Inter font family used in the application UI

### Testing Infrastructure (Optional)
- `playwright.azureedge.net` - Playwright CDN

**Purpose**: Playwright's official browser CDN for automated end-to-end testing

## Usage

### Content Security Policy

The `allowlist.json` file includes a `cspDirectives` section that can be used to configure Content Security Policy headers. Example directives:

```javascript
connect-src: 'self' https://accounts.google.com https://android.clients.google.com ...
font-src: 'self' https://fonts.googleapis.com https://fonts.gstatic.com
script-src: 'self' 'unsafe-inline' https://accounts.google.com
style-src: 'self' 'unsafe-inline' https://fonts.googleapis.com
```

### Network Configuration

For development or deployment, use the `flatList` array to configure:
- Firewall rules
- Proxy allowlists
- Network security groups
- API gateway configurations

### Accessing in Code

```javascript
import allowlist from './allowlist.json';

// Get all allowed domains
const domains = allowlist.flatList;

// Get specific category
const googleDomains = allowlist.allowedDomains.google.domains;

// Generate CSP header
const csp = Object.entries(allowlist.cspDirectives)
  .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
  .join('; ');
```

## Maintenance

When adding new external domains:

1. Update the appropriate category in `allowedDomains`
2. Add the domain to the `flatList` array
3. Update `cspDirectives` if needed for CSP headers
4. Document the purpose and use case
5. Mark as `optional: true` if not required for core functionality

## Security Considerations

- Review all domains periodically
- Remove unused domains
- Validate domain ownership and reputation
- Use HTTPS for all external resources
- Consider implementing Subresource Integrity (SRI) for CDN resources
