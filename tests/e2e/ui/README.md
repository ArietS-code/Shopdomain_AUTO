# E2E Test Suite

End-to-end testing suite using Playwright for multi-OPCO verification.

## Quick Start

```bash
# Run banner tests
npm run test:e2e:banner

# View HTML report
npm run test:e2e:report

# Debug mode
npm run test:e2e:ui
```

## Test Architecture

```
tests/
├── e2e/
│   ├── page-objects/
│   │   └── PlaywrightHomepagePage.ts      # Homepage interactions
│   ├── search-bar-banner.playwright.spec.ts  # Banner verification
│   └── README.md
├── config/
│   ├── test.config.ts                     # Multi-OPCO configuration
│   ├── opco.config.ts                     # OPCO utilities
│   └── user-agent.config.ts               # QA user agent
└── scripts/
    ├── verify-connection.js               # Environment verification
    └── open-browser.sh                    # Browser launcher
```

## Test Coverage

### Banner Verification Tests (13 tests)
**Main Suite (7 tests)**
- Display banner on search bar click
- Verify banner in DOM
- Verify banner elements
- Verify Get Coupon button
- Verify Sponsored label
- Non-logged-in user verification
- All elements present check

**Multi-OPCO Suite (6 tests)**
- Stop & Shop
- Giant Food  
- Food Lion
- Martins Foods
- Giant Food Stores
- Hannaford

## Configuration

### OPCOs
All tests run across 6 operating companies:
- **stopandshop** - Stop & Shop
- **giantfood** - Giant Food
- **foodlion** - Food Lion
- **martinsfoods** - Martins Foods
- **giantfoodstores** - Giant Food Stores
- **hannaford** - Hannaford

### Environments
- **delta** (default): `https://nonprd-delta.{opco}.com`
- **beta**: `https://nonprd-beta.{opco}.com`

### QA User Agent
```
qa-reg-(pdl)-cua/05:01; +reg/18
```
Required for bypassing security on non-prod environments.

## Test Results

### Output Locations
- **HTML Reports**: `test-results/html-report/`
- **Screenshots**: `test-results/screenshots/`
- **Videos**: `test-results/artifacts/`
- **Traces**: `test-results/artifacts/`

### Report Features
- Auto-opens after each test run
- Full screenshots on failure
- Video recording on failure
- Execution timeline
- Test duration metrics

## Page Object Model

### PlaywrightHomepagePage

**Selectors:**
- `searchInput` - Search bar input field
- `adusaBannerText` - Banner content element
- `getCouponButton` - Coupon CTA button
- `sponsoredLabel` - Sponsored label text
- `inStoreOption` - In-Store shopping method
- `pickupOption` - Pickup shopping method
- `deliveryOption` - Delivery shopping method

**Methods:**
- `goto(url)` - Navigate to URL
- `completeInitialSetup(method)` - Handle shopping method + store popup
- `clickSearchBar()` - Click search input
- `isAdusaBannerVisible()` - Check banner visibility
- `getAdusaBannerCount()` - Get banner element count
- `isGetCouponButtonVisible()` - Check coupon button
- `isSponsoredLabelVisible()` - Check sponsored label
- `takeScreenshot(name)` - Capture timestamped screenshot

## Development

### Adding New Tests
1. Create page object in `tests/e2e/page-objects/`
2. Create test spec with `.playwright.spec.ts` extension
3. Use QA user agent for non-prod
4. Follow existing patterns for multi-OPCO tests

### Best Practices
- One page object per page/component
- Use descriptive test names
- Include both positive and negative scenarios
- Test across all OPCOs when applicable
- Leverage page object methods
- Avoid hard-coded waits (use locator strategies)

## Troubleshooting

### Modal Blocking Interactions
The framework handles:
- Shopping method modal selection
- Store selection popup closure
- Modal overlay dismissal

### Timeout Issues
Default timeouts:
- Test: 30 seconds
- Expect: 10 seconds

Increase in `playwright.config.ts` if needed.

### User Agent Issues
Ensure QA user agent is set in test setup:
```typescript
await page.setExtraHTTPHeaders({
  'User-Agent': QA_USER_AGENT
});
```
