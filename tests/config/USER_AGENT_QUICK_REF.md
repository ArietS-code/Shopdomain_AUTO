# QA User Agent - Quick Reference

## 🔐 Current User Agent
```
qa-reg-(pdl)-cua/05:01; +reg/18
```

## 🎯 Purpose
Bypasses security block on **delta** and **beta** non-production environments.

## 📍 Location
[`tests/config/test.config.ts`](./test.config.ts)

```typescript
qaUserAgent: 'qa-reg-(pdl)-cua/05:01; +reg/18',
```

## ⚡ Quick Update

### Option 1: Config File (Permanent)
```bash
# Edit the config file
vi tests/config/test.config.ts

# Find and update this line:
qaUserAgent: 'qa-reg-(pdl)-cua/NEW:VERSION; +reg/NEW',
```

### Option 2: Environment Variable (Temporary)
```bash
# Set and run
TEST_USER_AGENT="qa-reg-(pdl)-cua/06:02; +reg/19" npm run test:unit
```

## ✅ Verification

### Check Current Value
```typescript
import { getQaUserAgent } from '../config/user-agent.config';
console.log(getQaUserAgent());
```

### Validate Format
```typescript
import { isValidQaUserAgent } from '../config/user-agent.config';
console.log(isValidQaUserAgent('qa-reg-(pdl)-cua/05:01; +reg/18')); // true
```

### Log Full Config
```typescript
import { logUserAgentConfig } from '../config/user-agent.config';
logUserAgentConfig(); // Displays full configuration
```

## 🔍 Testing
```bash
# Run user agent tests
npm run test:unit tests/config/user-agent.spec.ts

# Run with verbose logging
npm run test:unit -- --verbose tests/config/user-agent.spec.ts
```

## 📚 Documentation
- **Full Guide:** [USER_AGENT_GUIDE.md](./USER_AGENT_GUIDE.md)
- **Config File:** [test.config.ts](./test.config.ts)
- **Helper Functions:** [user-agent.config.ts](./user-agent.config.ts)
- **Tests:** [user-agent.spec.ts](./user-agent.spec.ts)

## ⚠️ Important Notes
- ✅ Automatically applied to all API requests
- ✅ Required for delta and beta environments
- ✅ Hard-coded but easily updatable
- ❌ Do not use in production
- 🔄 Update when new credentials are received

## 🆘 Troubleshooting

### Getting 403 Forbidden?
```bash
# Check current value
cat tests/config/test.config.ts | grep qaUserAgent

# Verify it's correct
echo $TEST_USER_AGENT
```

### Not working?
1. Restart test process
2. Clear any caches: `npm run test:unit -- --clearCache`
3. Verify format matches: `qa-reg-(pdl)-cua/XX:XX; +reg/XX`

## 📝 Version History
| Date | Version | Notes |
|------|---------|-------|
| 2026-01-23 | 05:01 / 18 | Initial setup |

---
**When you receive new credentials:** Update `qaUserAgent` in [`test.config.ts`](./test.config.ts)
