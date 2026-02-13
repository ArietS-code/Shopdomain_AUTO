# OPCO Configuration Guide

## Overview

The test framework supports testing across multiple OPCOs (Operating Companies) and environments. This allows you to run the same test suite against different brand instances.

## Supported OPCOs

- `stopandshop` - Stop & Shop
- `giantfood` - Giant Food
- `foodlion` - Food Lion
- `martinsfoods` - Martin's Foods
- `giantfoodstores` - Giant Food Stores
- `hannaford` - Hannaford

## Supported Environments

- `beta` - Beta environment (`https://nonprd-beta.<opco>.com/`)
- `delta` - Delta environment (`https://nonprd-delta.<opco>.com/`)

## Configuration

### Environment Variables

Set the OPCO and environment using environment variables:

```bash
# Set OPCO
export TEST_OPCO=stopandshop

# Set Environment
export TEST_ENV=delta

# Run tests
npm run test:unit
```

### Command Line Usage

```bash
# Test Stop & Shop on Delta (default)
npm run test:unit

# Test Giant Food on Beta
TEST_OPCO=giantfood TEST_ENV=beta npm run test:unit

# Test Food Lion on Delta
TEST_OPCO=foodlion TEST_ENV=delta npm run test:unit

# Test specific file with custom OPCO
TEST_OPCO=hannaford npm run test:unit tests/api-tests/products.api.spec.ts
```

## URL Structure

The base URL is automatically constructed as:
```
https://nonprd-{environment}.{opco}.com/
```

Examples:
- `https://nonprd-delta.stopandshop.com/`
- `https://nonprd-beta.giantfood.com/`
- `https://nonprd-delta.foodlion.com/`

## Using in Tests

### Get Current Configuration

```typescript
import { TEST_CONFIG } from '../config/test.config';

// Get current OPCO
console.log(TEST_CONFIG.opco); // 'stopandshop'

// Get current environment
console.log(TEST_CONFIG.environment); // 'delta'

// Get current base URL
console.log(TEST_CONFIG.baseUrl); // 'https://nonprd-delta.stopandshop.com/'
```

### Using OPCO Helpers

```typescript
import {
  getCurrentOpco,
  getCurrentEnvironment,
  getOpcoDisplayName,
  buildUrlForOpco,
} from '../config/opco.config';

// Get current configuration
const opco = getCurrentOpco();
const env = getCurrentEnvironment();
const displayName = getOpcoDisplayName(opco);

console.log(`Testing ${displayName} on ${env}`);

// Build URL for specific OPCO
const url = buildUrlForOpco('giantfood', 'beta');
// 'https://nonprd-beta.giantfood.com/'
```

### Test All OPCOs

```typescript
import { forEachOpco, buildUrlForOpco } from '../config/opco.config';
import { ProductsApi } from '../api/ProductsApi';

describe('Multi-OPCO Tests', () => {
  forEachOpco(async (opco, env) => {
    test('should connect to API', async () => {
      const baseUrl = buildUrlForOpco(opco, env);
      const api = new ProductsApi(baseUrl);
      
      const response = await api.getAllProducts();
      expect(response.success).toBe(true);
    });
  });
});
```

### Test Specific OPCOs

```typescript
import { forOpcos } from '../config/opco.config';

describe('East Coast OPCOs', () => {
  forOpcos(['stopandshop', 'giantfood', 'hannaford'], async (opco, env) => {
    test('should have regional products', async () => {
      // Test implementation
    });
  });
});
```

## Package.json Scripts

Add these scripts to your package.json for convenience:

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
    "test:delta": "TEST_ENV=delta npm run test:unit",
    
    "test:all-opcos": "npm run test:stopandshop && npm run test:giantfood && npm run test:foodlion && npm run test:martinsfoods && npm run test:giantfoodstores && npm run test:hannaford"
  }
}
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Multi-OPCO Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        opco: [stopandshop, giantfood, foodlion, martinsfoods, giantfoodstores, hannaford]
        env: [beta, delta]
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '22'
      
      - run: npm ci
      - run: npm run test:unit
        env:
          TEST_OPCO: ${{ matrix.opco }}
          TEST_ENV: ${{ matrix.env }}
```

## Best Practices

### 1. Always Specify OPCO in CI/CD
```bash
# Good
TEST_OPCO=stopandshop TEST_ENV=delta npm run test:unit

# Avoid (uses default)
npm run test:unit
```

### 2. Validate OPCO Values
```typescript
import { isValidOpco, isValidEnvironment } from '../config/opco.config';

const opco = process.env.TEST_OPCO;
if (!isValidOpco(opco)) {
  throw new Error(`Invalid OPCO: ${opco}`);
}
```

### 3. Log Current Configuration
```typescript
beforeAll(() => {
  console.log(`Testing ${TEST_CONFIG.opco} on ${TEST_CONFIG.environment}`);
  console.log(`Base URL: ${TEST_CONFIG.baseUrl}`);
});
```

### 4. Skip OPCO-Specific Tests
```typescript
test.skipIf(getCurrentOpco() !== 'stopandshop')('Stop & Shop only feature', () => {
  // Test implementation
});
```

## Troubleshooting

### Issue: Wrong URL being used
**Solution:** Check environment variables are set correctly
```bash
echo $TEST_OPCO
echo $TEST_ENV
```

### Issue: Tests failing for specific OPCO
**Solution:** Use OPCO-specific test data
```typescript
const testData = {
  stopandshop: { /* ... */ },
  giantfood: { /* ... */ },
  // ...
};

const data = testData[getCurrentOpco()];
```

### Issue: Need to override URL
**Solution:** Use environment variable
```bash
VITE_APP_BASE_URL=https://custom-url.com npm run test:unit
```

## Examples

### Simple Test with Current OPCO
```typescript
import { TEST_CONFIG } from '../config/test.config';
import { ProductsApi } from '../api/ProductsApi';

describe('Products API', () => {
  test('should connect', async () => {
    const api = new ProductsApi(TEST_CONFIG.baseUrl);
    const response = await api.getAllProducts();
    expect(response.success).toBe(true);
  });
});
```

### Test with Multiple OPCOs
```typescript
import { VALID_OPCOS, buildUrlForOpco } from '../config/opco.config';

describe('Cross-OPCO Compatibility', () => {
  VALID_OPCOS.forEach((opco) => {
    describe(opco, () => {
      test('should have consistent API', async () => {
        const url = buildUrlForOpco(opco, 'delta');
        // Test implementation
      });
    });
  });
});
```

## Summary

- ✅ 6 OPCOs supported
- ✅ 2 environments (beta, delta)
- ✅ Dynamic URL construction
- ✅ Easy configuration via env vars
- ✅ Helper functions for multi-OPCO tests
- ✅ CI/CD ready
