# QA User Agent Configuration Guide

## Overview

The test framework uses a **QA User Agent** to bypass security blocks on delta and beta non-production environments.

## Current User Agent

```
qa-reg-(pdl)-cua/05:01; +reg/18
```

**Format:** `qa-reg-(pdl)-cua/VERSION:VERSION; +reg/VERSION`

## Why is this needed?

When accessing delta and beta environments through automated tests, the security system requires a specific user agent string to identify QA traffic and allow access. Without this user agent, requests will be blocked by the security layer.

## Configuration Location

The user agent is configured in: [`tests/config/test.config.ts`](./test.config.ts)

```typescript
qaUserAgent: 'qa-reg-(pdl)-cua/05:01; +reg/18',
```

## How to Update

### Method 1: Update Configuration File (Permanent)

1. Open `tests/config/test.config.ts`
2. Find the `qaUserAgent` field:
   ```typescript
   qaUserAgent: 'qa-reg-(pdl)-cua/05:01; +reg/18',
   ```
3. Replace with the new value:
   ```typescript
   qaUserAgent: 'qa-reg-(pdl)-cua/06:02; +reg/19', // New version
   ```
4. Save the file
5. Restart your tests

### Method 2: Environment Variable (Temporary)

```bash
# Set environment variable
export TEST_USER_AGENT="qa-reg-(pdl)-cua/06:02; +reg/19"

# Run tests
npm run test:unit
```

### Method 3: Runtime Override (One-time)

```bash
# Override for single test run
TEST_USER_AGENT="qa-reg-(pdl)-cua/06:02; +reg/19" npm run test:unit
```

## Usage in Tests

The user agent is **automatically applied** to all API requests. You don't need to configure it in individual tests.

### Automatic Application

```typescript
import { ProductsApi } from '../api/ProductsApi';

// User agent is automatically included
const api = new ProductsApi();
const response = await api.getAllProducts();
```

### Check Current User Agent

```typescript
import { getQaUserAgent, logUserAgentConfig } from '../config/user-agent.config';

// Get current user agent
const userAgent = getQaUserAgent();
console.log(userAgent); // 'qa-reg-(pdl)-cua/05:01; +reg/18'

// Log full configuration
logUserAgentConfig();
```

### Validate User Agent Format

```typescript
import { isValidQaUserAgent } from '../config/user-agent.config';

const isValid = isValidQaUserAgent('qa-reg-(pdl)-cua/05:01; +reg/18');
console.log(isValid); // true
```

## Browser Testing

For UI tests using actual browsers (Playwright, Cypress, etc.), you'll need to set the user agent in the browser configuration:

### Example: Playwright Configuration

```typescript
import { chromium } from '@playwright/test';
import { getQaUserAgent } from './tests/config/user-agent.config';

const browser = await chromium.launch({
  args: [`--user-agent=${getQaUserAgent()}`],
});
```

### Example: Setting in DevTools (Manual Testing)

1. Open Chrome DevTools (F12)
2. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)
3. Type "Network conditions"
4. Select "Show Network conditions"
5. Uncheck "Use browser default"
6. Select "Custom..."
7. Enter: `qa-reg-(pdl)-cua/05:01; +reg/18`
8. Close the panel

## Verification

### Check if User Agent is Applied

```typescript
import { logUserAgentConfig } from '../config/user-agent.config';

// Before running tests
beforeAll(() => {
  logUserAgentConfig();
});
```

Output:
```
═══════════════════════════════════════════════════
QA User Agent Configuration
═══════════════════════════════════════════════════
User Agent: qa-reg-(pdl)-cua/05:01; +reg/18
Valid Format: ✓ YES
Environment: delta
OPCO: stopandshop
Base URL: https://nonprd-delta.stopandshop.com/
═══════════════════════════════════════════════════
```

### Test API Request

```typescript
import { ProductsApi } from '../api/ProductsApi';

test('should access API with QA user agent', async () => {
  const api = new ProductsApi();
  const response = await api.getAllProducts();
  
  // If user agent is correct, request should succeed
  expect(response.status).not.toBe(403); // Not forbidden
  expect(response.status).not.toBe(401); // Not unauthorized
});
```

## Troubleshooting

### Issue: Getting 403 Forbidden

**Cause:** User agent is incorrect or not being sent

**Solution:**
1. Verify user agent is correct: `echo $TEST_USER_AGENT`
2. Check configuration: `cat tests/config/test.config.ts | grep qaUserAgent`
3. Ensure you have the latest version from your QA team
4. Restart your test process

### Issue: User Agent Not Applied

**Cause:** Configuration not loaded or overridden

**Solution:**
```typescript
import TEST_CONFIG from '../config/test.config';

console.log('User Agent:', TEST_CONFIG.qaUserAgent);
```

### Issue: Need Different User Agent per Environment

**Current Implementation:** Same user agent for all environments

**Future Enhancement:** Add environment-specific user agents

```typescript
// Future implementation
qaUserAgents: {
  beta: 'qa-reg-(pdl)-cua/05:01; +reg/18',
  delta: 'qa-reg-(pdl)-cua/06:02; +reg/19',
}
```

## Security Notes

⚠️ **Important Security Information:**

1. **Non-Production Only:** This user agent is ONLY for non-production environments (beta, delta)
2. **Do Not Use in Production:** Never use QA user agents in production
3. **Keep Updated:** QA team may rotate these values for security
4. **Do Not Commit Secrets:** If user agent becomes a secret token, use environment variables

## Getting New User Agent

When you receive a new user agent from the QA/Security team:

1. **Update Configuration:**
   ```bash
   # Edit test.config.ts
   vi tests/config/test.config.ts
   
   # Update this line:
   qaUserAgent: 'NEW-VALUE-HERE',
   ```

2. **Test It:**
   ```bash
   npm run test:unit tests/api-tests/products.api.spec.ts
   ```

3. **Commit Changes:**
   ```bash
   git add tests/config/test.config.ts
   git commit -m "Update QA user agent to version X.XX"
   ```

4. **Notify Team:**
   - Update team documentation
   - Notify CI/CD administrators
   - Update any deployment scripts

## Version History

| Date | Version | User Agent | Notes |
|------|---------|------------|-------|
| 2026-01-23 | 1.0 | `qa-reg-(pdl)-cua/05:01; +reg/18` | Initial configuration |

## References

- Configuration: [`tests/config/test.config.ts`](./test.config.ts)
- Helper Functions: [`tests/config/user-agent.config.ts`](./user-agent.config.ts)
- API Client: [`tests/api/ApiClient.ts`](../api/ApiClient.ts)

---

**Last Updated:** January 23, 2026  
**Maintained By:** QA Team  
**Contact:** Update when you receive new credentials
