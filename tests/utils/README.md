# API Test Utilities

## Overview
This directory contains shared utility functions for API testing, following the **Page Object Model (POM)** principles for better code organization, reusability, and maintainability.

## Files

### `api-helpers.ts`
Common API helper functions for all API test suites.

#### Key Functions:

**API Calls:**
- `callApi()` - Makes HTTP GET requests with standard headers
  - Accepts: request context, URL, referer URL, timeout
  - Returns: status code and response body
  - Handles JSON parsing and error handling

**Product Extraction:**
- `getProducts()` - Extracts products array from API response
- `getSponsoredProducts()` - Filters products with sponsored=true or sponsoredProductInfo
- `getAuctionedProducts()` - Filters products with auctionId
- `getAuctionIds()` - Extracts unique auction IDs from products

**Validations:**
- `validateNoCitrusReferences()` - Ensures no deprecated Citrus references
- `validateStatusCode()` - Validates HTTP status codes
- `validateProductsExist()` - Ensures products array is not empty
- `validateSponsoredProductsExist()` - Validates sponsored products presence
- `validateAuctionIdsExist()` - Validates auction IDs exist

#### Type Definitions:
```typescript
Product - Common product interface
ApiResponse - Standard API response structure
```

### `gambit-helpers.ts`
Helpers specific to Gambit UI testing (existing).

### `test-helpers.ts`
General test helper functions (existing).

## Usage Examples

### Importing Utilities
```typescript
import {
  callApi,
  getProducts,
  getSponsoredProducts,
  validateNoCitrusReferences,
  type ApiResponse,
  type Product,
} from '../../utils/api-helpers';
```

### Making API Calls
```typescript
const result = await callApi(request, apiUrl, refererUrl, TIMEOUT);
const products = getProducts(result.body);
const sponsoredProducts = getSponsoredProducts(products);
```

### Validations
```typescript
validateNoCitrusReferences(responseBody);
validateStatusCode(responseStatus, 200);
validateAuctionIdsExist(auctionIds);
```

## Benefits of This Approach

### 1. **DRY Principle**
- No duplicate code across test files
- Single source of truth for common functions
- Easier to maintain and update

### 2. **Page Object Model (POM)**
- Separation of concerns: test logic vs. helper functions
- Business logic encapsulated in utility functions
- Test files focus on test scenarios, not implementation details

### 3. **Consistency**
- Same behavior across all API tests
- Standardized error handling
- Uniform validation approach

### 4. **Maintainability**
- Changes to API structure require updates in one place
- Easy to add new helper functions
- Clear documentation and type safety

### 5. **Readability**
- Test files are cleaner and easier to read
- Function names clearly describe their purpose
- Less clutter in test code

## Test Files Using These Utilities

1. **`/tests/e2e/api/product-auctioned-api.playwright.spec.ts`**
   - Auctioned Products API (itemdetail)
   - Past Purchase API (pastpurchases)
   - 18 tests across 6 OPCOs

2. **`/tests/e2e/api/product-search-api.playwright.spec.ts`**
   - Product Search API
   - 6 tests across 6 OPCOs

## Adding New Helper Functions

When creating new API test files:

1. **Check existing helpers first** - Don't duplicate functionality
2. **Add new helpers to `api-helpers.ts`** if they can be reused
3. **Follow naming conventions** - Clear, descriptive function names
4. **Add TypeScript types** - Ensure type safety
5. **Document your functions** - Add JSDoc comments
6. **Update this README** - Keep documentation current

## Example: Before vs. After Refactoring

### Before (Duplicated Code):
```typescript
// In product-auctioned-api.playwright.spec.ts
async function callAuctionedProductsApi(request, url, refererUrl) {
  const response = await request.get(url, {
    headers: { /* ... */ },
    timeout: TIMEOUT,
  });
  // ... more code
}

// In product-search-api.playwright.spec.ts
async function callProductSearchApi(request, url, refererUrl) {
  const response = await request.get(url, {
    headers: { /* ... */ }, // Same headers!
    timeout: TIMEOUT,
  });
  // ... same code
}
```

### After (Shared Utilities):
```typescript
// In both files
import { callApi } from '../../utils/api-helpers';

// Use it
const result = await callApi(request, apiUrl, refererUrl, TIMEOUT);
```

## Best Practices

1. **Import only what you need** - Keep imports clean
2. **Use TypeScript types** - Import `Product`, `ApiResponse` types
3. **Handle errors gracefully** - Utilities have built-in error handling
4. **Keep test-specific logic in test files** - Don't over-abstract
5. **Write pure functions** - Utilities should be stateless
6. **Follow async/await patterns** - Consistent async handling

## Future Enhancements

Potential additions to consider:

- [ ] POST/PUT/DELETE API helpers
- [ ] Response caching utilities
- [ ] API mock data generators
- [ ] Performance measurement helpers
- [ ] Retry logic for flaky APIs
- [ ] API comparison utilities (expected vs actual)
