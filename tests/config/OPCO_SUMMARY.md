# OPCO Configuration Summary

## ✅ What Was Updated

The test framework now supports **dynamic multi-OPCO and multi-environment testing**.

## 🎯 Key Features

### 1. **Dynamic Base URL Construction**
- URL Pattern: `https://nonprd-{environment}.{opco}.com/`
- Automatically built based on OPCO and environment
- Configurable via environment variables

### 2. **Supported OPCOs**
1. `stopandshop` → Stop & Shop
2. `giantfood` → Giant Food
3. `foodlion` → Food Lion
4. `martinsfoods` → Martin's Foods
5. `giantfoodstores` → Giant Food Stores
6. `hannaford` → Hannaford

### 3. **Supported Environments**
- `beta` → Beta environment (`nonprd-beta`)
- `delta` → Delta environment (`nonprd-delta`)

## 📦 Files Created/Updated

### Updated
- ✅ `tests/config/test.config.ts` - Added OPCO and environment support

### Created
- ✅ `tests/config/opco.config.ts` - OPCO helper functions
- ✅ `tests/config/OPCO_GUIDE.md` - Complete OPCO documentation
- ✅ `tests/api-tests/multi-opco.spec.ts` - Example multi-OPCO tests

## 🚀 Quick Start

### Basic Usage

```bash
# Default: Stop & Shop on Delta
npm run test:unit

# Specific OPCO
TEST_OPCO=giantfood npm run test:unit

# Specific Environment
TEST_ENV=beta npm run test:unit

# Combine both
TEST_OPCO=foodlion TEST_ENV=beta npm run test:unit
```

### In Test Code

```typescript
import { TEST_CONFIG } from '../config/test.config';

// Current configuration
console.log(TEST_CONFIG.opco);        // 'stopandshop'
console.log(TEST_CONFIG.environment); // 'delta'
console.log(TEST_CONFIG.baseUrl);     // 'https://nonprd-delta.stopandshop.com/'
```

## 📚 Configuration Reference

### Environment Variables

| Variable | Description | Valid Values | Default |
|----------|-------------|--------------|---------|
| `TEST_OPCO` | Operating Company | `stopandshop`, `giantfood`, `foodlion`, `martinsfoods`, `giantfoodstores`, `hannaford` | `stopandshop` |
| `TEST_ENV` | Environment | `beta`, `delta` | `delta` |
| `VITE_APP_BASE_URL` | Override base URL | Any valid URL | Auto-generated |

### URL Examples

```
# Stop & Shop Delta
https://nonprd-delta.stopandshop.com/

# Giant Food Beta
https://nonprd-beta.giantfood.com/

# Food Lion Delta
https://nonprd-delta.foodlion.com/

# Hannaford Beta
https://nonprd-beta.hannaford.com/
```

## 🔧 Helper Functions

### opco.config.ts Exports

```typescript
import {
  getCurrentOpco,           // Get current OPCO
  getCurrentEnvironment,    // Get current environment
  getCurrentBaseUrl,        // Get current base URL
  buildUrlForOpco,         // Build URL for specific OPCO
  getOpcoDisplayName,      // Get display name
  forEachOpco,             // Test all OPCOs
  forOpcos,                // Test specific OPCOs
  isValidOpco,             // Validate OPCO
  isValidEnvironment,      // Validate environment
} from '../config/opco.config';
```

## 📝 Example Test Patterns

### 1. Test Current OPCO

```typescript
import { TEST_CONFIG } from '../config/test.config';
import { ProductsApi } from '../api/ProductsApi';

test('should work with current OPCO', async () => {
  const api = new ProductsApi(TEST_CONFIG.baseUrl);
  const response = await api.getAllProducts();
  expect(response.success).toBe(true);
});
```

### 2. Test All OPCOs

```typescript
import { forEachOpco, buildUrlForOpco } from '../config/opco.config';

forEachOpco(async (opco, env) => {
  test('should connect to API', async () => {
    const url = buildUrlForOpco(opco, env);
    const api = new ProductsApi(url);
    const response = await api.getAllProducts();
    expect(response.success).toBe(true);
  });
});
```

### 3. Test Specific OPCOs

```typescript
import { forOpcos } from '../config/opco.config';

forOpcos(['stopandshop', 'giantfood'], async (opco, env) => {
  test('should have feature', async () => {
    // Test implementation
  });
});
```

### 4. OPCO-Specific Tests

```typescript
import { getCurrentOpco } from '../config/opco.config';

test.skipIf(getCurrentOpco() !== 'stopandshop')('Stop & Shop only', () => {
  // Stop & Shop specific test
});
```

## 🎨 Suggested NPM Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "test:stopandshop": "TEST_OPCO=stopandshop npm run test:unit",
    "test:giantfood": "TEST_OPCO=giantfood npm run test:unit",
    "test:foodlion": "TEST_OPCO=foodlion npm run test:unit",
    "test:martinsfoods": "TEST_OPCO=martinsfoods npm run test:unit",
    "test:giantfoodstores": "TEST_OPCO=giantfoodstores npm run test:unit",
    "test:hannaford": "TEST_OPCO=hannaford npm run test:unit",
    
    "test:beta": "TEST_ENV=beta npm run test:unit",
    "test:delta": "TEST_ENV=delta npm run test:unit"
  }
}
```

## 🤖 CI/CD Integration

### GitHub Actions Matrix Strategy

```yaml
strategy:
  matrix:
    opco: [stopandshop, giantfood, foodlion, martinsfoods, giantfoodstores, hannaford]
    env: [beta, delta]

steps:
  - run: npm run test:unit
    env:
      TEST_OPCO: ${{ matrix.opco }}
      TEST_ENV: ${{ matrix.env }}
```

## ✨ Benefits

1. **Single Test Suite** - Write once, test across all OPCOs
2. **Easy Configuration** - Change OPCO with environment variable
3. **Type Safety** - TypeScript ensures valid OPCO values
4. **Flexibility** - Test all OPCOs or specific ones
5. **CI/CD Ready** - Matrix testing support
6. **No Code Changes** - Switch OPCOs without modifying tests

## 📖 Documentation

- **Main Guide:** [tests/config/OPCO_GUIDE.md](./config/OPCO_GUIDE.md)
- **Config File:** [tests/config/test.config.ts](./config/test.config.ts)
- **Helpers:** [tests/config/opco.config.ts](./config/opco.config.ts)
- **Examples:** [tests/api-tests/multi-opco.spec.ts](./api-tests/multi-opco.spec.ts)

## 🎯 Next Steps

1. Set your preferred OPCO: `export TEST_OPCO=stopandshop`
2. Set your environment: `export TEST_ENV=delta`
3. Run tests: `npm run test:unit`
4. View the complete guide: [OPCO_GUIDE.md](./config/OPCO_GUIDE.md)

---

**Configuration Version:** 1.0.0  
**Last Updated:** January 23, 2026  
**Default OPCO:** stopandshop  
**Default Environment:** delta
