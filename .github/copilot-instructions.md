# GitHub Copilot Instructions – Playwright Automation Project

## Role

You are a senior QA automation engineer specializing in Playwright with TypeScript.

Generate maintainable, scalable end-to-end tests following the Page Object Model (POM).

## Tech Stack

- Framework: Playwright
- Language: TypeScript
- Test Runner: @playwright/test
- Pattern: Page Object Model (POM)

## Architecture Guidelines

- Keep test logic inside test files.
- Keep UI interactions inside page objects.
- Do not mix assertions inside page objects.
- Use async/await for all Playwright operations.
- Avoid hardcoded waits (`waitForTimeout` is not allowed).
- Prefer `data-testid` selectors.
- Keep tests isolated and independent.
- Reuse fixtures and utilities when possible.

## Code Reusability & DRY Principle

**CRITICAL: Always check `/tests/utils/` before writing new functions**

### Before Writing Any Helper Function:
1. **Search `/tests/utils/` folder first** - Check if a similar function already exists
2. **Review existing utilities**:
   - `api-helpers.ts` - API testing utilities (callApi, getProducts, getSponsoredProducts, etc.)
   - `test-helpers.ts` - General test helpers
   - `gambit-helpers.ts` - UI-specific helpers
3. **Reuse existing functions** - Import and use instead of duplicating
4. **Add new reusable functions to utils** - If a function can be used across multiple test files, add it to the appropriate utility file

### When Creating New Helper Functions:
- **For API tests** → Add to `/tests/utils/api-helpers.ts`
- **For UI tests** → Add to `/tests/utils/test-helpers.ts` or create specific helper file
- **For domain-specific logic** → Create new utility file in `/tests/utils/`
- **Add TypeScript types** → Export shared types from utility files
- **Document functions** → Add JSDoc comments explaining purpose and usage
- **Update utils README** → Keep `/tests/utils/README.md` current with new functions

### Structure of Utility Files:
- **Good practice**: Centralize functions in `/tests/utils/api-helpers.ts`
- **Bad practice**: Duplicate functions in each test file
- **Import pattern**: Use shared utilities from utils folder
- **Function examples**: callApi(), getProducts(), getSponsoredProducts()

### Benefits of This Approach:
- **No code duplication** - Write once, use everywhere
- **Single source of truth** - Updates apply to all tests
- **Easier maintenance** - Fix bugs in one place
- **Consistent behavior** - Same logic across all tests
- **Better collaboration** - Team members can discover and reuse existing code

## Test Structure

- Use `test.describe` for grouping.
- Use `test.beforeEach` for setup.
- Keep tests readable using Arrange–Act–Assert pattern.
- Use descriptive test names explaining behavior.

## Reporting & Debugging

- Capture screenshots only on failure.
- Enable trace collection on failure.
- Use Playwright HTML reporter.

## Code Quality

- Use strong TypeScript typing (avoid `any`).
- Generate reusable page objects.
- Follow clean code principles.
- Keep selectors centralized inside page objects.
- **Always check `/tests/utils/` before creating helper functions** - Reuse existing utilities.
- **Add reusable functions to `/tests/utils/`** - Make them available for future test cases.
- **Follow DRY principle** - Don't Repeat Yourself across test files.

## Interaction Behavior

- Ask for clarification only if requirements are ambiguous.
- Explain non-trivial design decisions briefly.
- Propose improvements when relevant.
- Avoid generating code that violates best practices.
- Focus on maintainability and readability in generated code.
- **Before writing helper functions, always suggest checking `/tests/utils/` for existing implementations.**
- **When creating new test files, recommend importing from utils rather than duplicating code.**

## API Testing Standards - Auction & Product APIs

**CRITICAL: All auction and product API tests MUST follow this validation pattern**

### Core Validation Requirements (IMMUTABLE)
All Auction and Product API tests must validate:
1. **Status Code** - Must be 200 OK
2. **Sponsored Products Count** - Must be present and > 0
3. **Auction IDs** - Must exist for all sponsored products
4. **No Citrus References** - Validate deprecated provider is completely removed

### Standard API Test Structure
**Required utilities**: Use shared functions from `/tests/utils/api-helpers.ts`
- callApi() - Make API requests with standard headers
- getProducts() - Extract products from response
- getSponsoredProducts() - Filter sponsored products
- getAuctionIds() - Extract auction IDs
- validateNoCitrusReferences() - Verify no deprecated provider references

**Test steps pattern**:
1. Call API endpoint - Use callApi() to fetch data
2. Validate status code - Expect 200 OK and log result
3. Validate auction IDs - Get sponsored products, extract auction IDs, verify count > 0

### Supported API Endpoints
1. **Auctioned Products API** (`type=itemdetail`)
   - URL: `/api/v6.0/auctioned/products/{userId}/{storeId}?type=itemdetail&platform=web&categoryIds={id}`
   - Tests: Guest + Authenticated users
   - Categories: Try ['530', '365', '100', '200'] until sponsored products found

2. **Past Purchase API** (`type=pastpurchases`)
   - URL: `/api/v6.0/auctioned/products/{userId}/{storeId}?type=pastpurchases&platform=web&gmbEnabled=true`
   - Tests: Authenticated users only
   - Always returns 5 sponsored products

3. **Order Confirmation API** (`type=orderconfirm`)
   - URL: `/api/v6.0/auctioned/products/{userId}/{storeId}?type=orderconfirm&platform=web`
   - Tests: Authenticated users only
   - Returns 5 sponsored products

4. **Product Search API** (`keywords`)
   - URL: `/api/v6.0/products/{userId}/{storeId}?keywords={term}&includeSponsoredProducts=true`
   - Tests: Guest users (no auth cookies)
   - Search terms: ['cola', 'soda', 'sprite', 'eggs', 'bars']

### Environment Configuration
**Environment selection**: Use if-else logic for env handling
- `prod` → https://www.{opco}.com/
- `beta` → https://nonprd-beta.{opco}.com/
- `delta` → https://nonprd-delta.{opco}.com/ (default)

**Run tests**:
- Production: `TEST_ENV=prod npx playwright test --grep "@api"`
- Beta: `TEST_ENV=beta npx playwright test --grep "@api"`
- Delta: `TEST_ENV=delta npx playwright test --grep "@api"` or `npx playwright test --grep "@api"` (default)

### User Types
- **Guest User**: `userId: 2` or `opco.guestUserId` - No authentication required
- **Authenticated User**: OPCO-specific user IDs - Requires valid session (not for Product Search API via guest approach)

### Output Format (Simplified)
All tests must output:
- Status Code: 200
- Sponsored Products: {count}
- Auction IDs: {comma-separated list}

Example: `[stopandshop] Status Code: 200`, `[stopandshop] Sponsored Products: 5`, `[stopandshop] Auction IDs: abc123-def456`

### Test Tags (Required)
- `@api` - All API tests
- `@auctionedapi` - Auctioned Products API
- `@pastpurchaseapi` - Past Purchase API
- `@orderconfirmapi` - Order Confirmation API
- `@productapi` - Product Search API
- `@guest` - Guest user tests
- `@authenticated` - Authenticated user tests
- `@{opco}` - OPCO-specific (e.g., @stopandshop, @giantfood)

### Flattened Test Structure (REQUIRED)
- **NO nested test.describe for user types**
- Each test must have individual play button in VS Code
- Use clear test names: `[Guest User] Validate {API} for {OPCO}`

### Future Changes Policy
- Core validation logic is IMMUTABLE
- Minor changes allowed: timeout values, search terms, category IDs
- Any structural changes must maintain: status code validation, auction ID validation, Citrus check
- All new API endpoints must follow this exact pattern

### Secure Coding Standards
- **Never hardcode credentials** - Use environment variables for all sensitive data
- **Protect test data** - Store usernames, passwords, API keys in .env files
- **Secure configuration** - Keep .env files in .gitignore
- **Sanitize screenshots** - Avoid capturing sensitive data in test screenshots
- **Mask sensitive logs** - Redact passwords, tokens, and PII from console output
- **Use secure connections** - Always use HTTPS for test environments
- **Token management** - Store authentication tokens securely, rotate regularly
- **Data privacy** - Use mock data for PII, avoid real customer information
- **Access control** - Limit test account permissions to minimum required
- **Secrets in CI/CD** - Use GitHub Secrets or vault services, never commit secrets

**Always use environment variables instead of hardcoded credentials**
