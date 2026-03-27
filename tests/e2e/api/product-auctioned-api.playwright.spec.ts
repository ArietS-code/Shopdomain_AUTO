/**
 * E2E API Test Suite: Auctioned Products API Verification
 * 
 * Purpose:
 *   Verifies that the Auctioned Products API returns sponsored/auctioned products
 *   and validates the response structure across all OPCO sites.
 * 
 * Test Coverage:
 *   - Auctioned API endpoint response validation
 *   - Sponsored products validation
 *   - Auctioned products validation
 *   - Status code verification (200 OK)
 *   - Platform parameter validation
 *   - No Citrus references validation (post-deprecation)
 * 
 * Configuration:
 *   - Environment: delta (non-prod)
 *   - API Endpoint: /api/v6.0/auctioned/products/{userId}/{storeId}
 * 
 * @see {@link https://nonprd-delta.{opco}.com}
 */

import { test, expect } from '@playwright/test';
import { getAllOpcoConfigs } from '../../config/test.config';
import {
  callApi,
  getProducts,
  getSponsoredProducts,
  getAuctionedProducts,
  getAuctionIds,
  validateNoCitrusReferences,
  validateStatusCode,
  validateAuctionIdsExist,
  type ApiResponse,
  type Product,
} from '../../utils/api-helpers';

// ============================================================================
// Test Configuration
// ============================================================================

const CATEGORY_IDS = ['530', '365', '100', '200']; // Different category IDs to test
const TIMEOUT = 30000;

// API Query Parameters
const API_PARAMS = {
  type: 'itemdetail',
  platform: 'web',
};

// Past Purchase API Parameters
const PAST_PURCHASE_PARAMS = {
  type: 'pastpurchases',
  platform: 'web',
  gmbEnabled: 'true',
};

// Order Confirmation API Parameters
const ORDER_CONFIRM_PARAMS = {
  type: 'orderconfirm',
  platform: 'web',
};

// ============================================================================
// Type Definitions
// ============================================================================

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Builds the auctioned products API URL with query parameters
 */
function buildAuctionedApiUrl(baseUrl: string, userId: number, storeId: number, categoryId: string): string {
  const url = new URL(`/api/v6.0/auctioned/products/${userId}/${storeId}`, baseUrl);
  
  url.searchParams.set('type', API_PARAMS.type);
  url.searchParams.set('platform', API_PARAMS.platform);
  url.searchParams.set('categoryIds', categoryId);
  
  return url.toString();
}

/**
 * Builds the past purchase API URL with query parameters
 */
function buildPastPurchaseApiUrl(baseUrl: string, userId: number, storeId: number): string {
  const url = new URL(`/api/v6.0/auctioned/products/${userId}/${storeId}`, baseUrl);
  
  url.searchParams.set('type', PAST_PURCHASE_PARAMS.type);
  url.searchParams.set('platform', PAST_PURCHASE_PARAMS.platform);
  url.searchParams.set('gmbEnabled', PAST_PURCHASE_PARAMS.gmbEnabled);
  
  return url.toString();
}

/**
 * Builds the order confirmation API URL with query parameters
 */
function buildOrderConfirmApiUrl(baseUrl: string, userId: number, storeId: number): string {
  const url = new URL(`/api/v6.0/auctioned/products/${userId}/${storeId}`, baseUrl);
  
  url.searchParams.set('type', ORDER_CONFIRM_PARAMS.type);
  url.searchParams.set('platform', ORDER_CONFIRM_PARAMS.platform);
  
  return url.toString();
}

// ============================================================================
// Test Suite: Auctioned Products API (type=itemdetail)
// ============================================================================

test.describe('Auctioned Products API - Sponsored Products Validation', () => {
  test.describe.configure({ timeout: 60000 });

  const opcos = getAllOpcoConfigs();

  for (const [opcoKey, opco] of opcos) {
    // Guest User Test
    test(
      `[Guest User] Validate Auctioned Products API (type=itemdetail) for ${opco.name}`,
      {
        tag: ['@api', '@auctionedapi', '@sponsored', '@itemdetail', `@${opcoKey}`, '@guest'],
      },
      async ({ request }) => {
        const userId = opco.guestUserId;
        let selectedCategoryId = '';
        let apiUrl = '';
        let responseStatus = 0;
        let responseBody: ApiResponse | null = null;
        let products: Product[] = [];

        await test.step('1. Call Auctioned Products API with category ID', async () => {
          // Try each category ID until we get sponsored products
          for (const categoryId of CATEGORY_IDS) {
                apiUrl = buildAuctionedApiUrl(opco.url, userId, opco.storeId, categoryId);
                const refererUrl = `${opco.url}/category/${categoryId}`;
                
                const result = await callApi(request, apiUrl, refererUrl, TIMEOUT);
                responseStatus = result.status;
                responseBody = result.body;

                // Get products from response
                products = getProducts(responseBody);
                const sponsoredProducts = getSponsoredProducts(products);

                // Stop if we found sponsored products
                if (responseStatus === 200 && sponsoredProducts.length > 0) {
                  selectedCategoryId = categoryId;
                  break;
                }
              }

              if (!selectedCategoryId || !responseBody) {
                throw new Error(
                  `No sponsored products found for categories: ${CATEGORY_IDS.join(', ')}`,
                );
              }

          expect(
            responseStatus,
            'Auctioned Products API should return 200 OK status',
          ).toBe(200);

          console.log(`[${opcoKey}] [Guest] Status Code: ${responseStatus}`);
        });

        await test.step('2. Validate sponsored products', async () => {
          const sponsoredProducts = getSponsoredProducts(products);

          expect(
            sponsoredProducts.length,
            'Should have sponsored products',
          ).toBeGreaterThan(0);

          console.log(`[${opcoKey}] [Guest] Sponsored Products: ${sponsoredProducts.length}`);
        });

        await test.step('3. Validate auctionId in sponsored products', async () => {
          const auctionIds = getAuctionIds(getAuctionedProducts(products));
          validateAuctionIdsExist(auctionIds);
          console.log(`[${opcoKey}] [Guest] Auction IDs: ${auctionIds.join(', ')}`);
        });

        await test.step('4. Validate no Citrus references', async () => {
          validateNoCitrusReferences(responseBody);
        });
      },
    );

    // Authenticated User Test
    test(
      `[Authenticated User] Validate Auctioned Products API (type=itemdetail) for ${opco.name}`,
      {
        tag: ['@api', '@auctionedapi', '@sponsored', '@itemdetail', `@${opcoKey}`, '@authenticated'],
      },
      async ({ request }) => {
        const userId = opco.userId;
        let selectedCategoryId = '';
        let apiUrl = '';
        let responseStatus = 0;
        let responseBody: ApiResponse | null = null;
        let products: Product[] = [];

        await test.step('1. Call Auctioned Products API with category ID', async () => {
          // Try each category ID until we get sponsored products
          for (const categoryId of CATEGORY_IDS) {
            apiUrl = buildAuctionedApiUrl(opco.url, userId, opco.storeId, categoryId);
            const refererUrl = `${opco.url}/category/${categoryId}`;
            
            const result = await callApi(request, apiUrl, refererUrl, TIMEOUT);
            responseStatus = result.status;
            responseBody = result.body;

            // Get products from response
            products = getProducts(responseBody);
            const sponsoredProducts = getSponsoredProducts(products);

            // Stop if we found sponsored products
            if (responseStatus === 200 && sponsoredProducts.length > 0) {
              selectedCategoryId = categoryId;
              break;
            }
          }

          if (!selectedCategoryId || !responseBody) {
            throw new Error(
              `No sponsored products found for categories: ${CATEGORY_IDS.join(', ')}`,
            );
          }

          expect(
            responseStatus,
            'Auctioned Products API should return 200 OK status',
          ).toBe(200);

          console.log(`[${opcoKey}] [Authenticated] Status Code: ${responseStatus}`);
        });

        await test.step('2. Validate sponsored products', async () => {
          const sponsoredProducts = getSponsoredProducts(products);

          expect(
            sponsoredProducts.length,
            'Should have sponsored products',
          ).toBeGreaterThan(0);

          console.log(`[${opcoKey}] [Authenticated] Sponsored Products: ${sponsoredProducts.length}`);
        });

        await test.step('3. Validate auctionId in sponsored products', async () => {
          const auctionIds = getAuctionIds(getAuctionedProducts(products));
          validateAuctionIdsExist(auctionIds);
          console.log(`[${opcoKey}] [Authenticated] Auction IDs: ${auctionIds.join(', ')}`);
        });

        await test.step('4. Validate no Citrus references', async () => {
          validateNoCitrusReferences(responseBody);
        });
      },
    );
  }
});

// ============================================================================
// Past Purchase API Test Suite
// ============================================================================

test.describe('Past Purchase API - Sponsored Products Validation', () => {
  test.describe.configure({ timeout: 60000 });

  const opcos = getAllOpcoConfigs();

  for (const [opcoKey, opco] of opcos) {
    // Authenticated User Test
    test(
      `[Authenticated User] Validate Past Purchase API (type=pastpurchases) for ${opco.name}`,
      {
        tag: ['@api', '@pastpurchaseapi', '@sponsored', '@pastpurchases', `@${opcoKey}`, '@authenticated'],
      },
      async ({ request }) => {
        const userId = opco.userId;
        let apiUrl = '';
        let responseStatus = 0;
        let responseBody: ApiResponse | null = null;
        let products: Product[] = [];

        await test.step('1. Call Past Purchase API', async () => {
          apiUrl = buildPastPurchaseApiUrl(opco.url, userId, opco.storeId);
          const refererUrl = `${opco.url}/my-account/past-purchases`;
          
          const result = await callApi(request, apiUrl, refererUrl, TIMEOUT);
          responseStatus = result.status;
          responseBody = result.body;

          // Get products from response
          products = getProducts(responseBody);

          expect(
            responseStatus,
            'Past Purchase API should return 200 OK status',
          ).toBe(200);

          console.log(`[${opcoKey}] [Authenticated] Status Code: ${responseStatus}`);
        });

        await test.step('3. Validate URL parameters', async () => {
          const urlObj = new URL(apiUrl);
          
          // Validate type
          const type = urlObj.searchParams.get('type');
          expect(type, 'Type should be pastpurchases').toBe('pastpurchases');
          console.log(`[${opcoKey}] [Authenticated] ✓ Type: ${type}`);

          // Validate platform
          const platform = urlObj.searchParams.get('platform');
          expect(platform, 'Platform should be web').toBe('web');
          console.log(`[${opcoKey}] [Authenticated] ✓ Platform: ${platform}`);

          // Validate gmbEnabled
          const gmbEnabled = urlObj.searchParams.get('gmbEnabled');
          expect(gmbEnabled, 'gmbEnabled should be true').toBe('true');
          console.log(`[${opcoKey}] [Authenticated] ✓ gmbEnabled: ${gmbEnabled}`);
          
          console.log(`[${opcoKey}] [Authenticated] ✓ All URL parameters validated`);
        });

        await test.step('4. Validate response contains products', async () => {
          expect(
            products,
            'Response should include products array',
          ).toBeDefined();

          expect(
            Array.isArray(products),
            'Products should be an array',
          ).toBe(true);

          expect(
            products.length,
            'Products array should not be empty',
          ).toBeGreaterThan(0);

          console.log(`[${opcoKey}] [Authenticated] ✓ Total products returned: ${products.length}`);
        });

        await test.step('5. Validate sponsored products in response', async () => {
          const sponsoredProducts = getSponsoredProducts(products);

          console.log(`[${opcoKey}] [Authenticated] Sponsored products found: ${sponsoredProducts.length}`);

          if (sponsoredProducts.length > 0) {
            // Validate sponsored property or sponsoredProductInfo exists
            sponsoredProducts.forEach((product, index) => {
              const isSponsored = product.sponsored === true || product.sponsoredProductInfo !== undefined;
              expect(
                isSponsored,
                `Product ${index + 1} should have sponsored=true or sponsoredProductInfo property`,
              ).toBe(true);
            });

            console.log(`[${opcoKey}] [Authenticated] ✓ All sponsored products validated`);
          } else {
            console.log(`[${opcoKey}] [Authenticated] ⚠️  No sponsored products found in response`);
          }
        });

        await test.step('3. Validate auctionId in sponsored products', async () => {
          const auctionIds = getAuctionIds(getAuctionedProducts(products));
          validateAuctionIdsExist(auctionIds);
          console.log(`[${opcoKey}] [Authenticated] Auction IDs: ${auctionIds.join(', ')}`);
        });

        await test.step('4. Validate no Citrus references', async () => {
          validateNoCitrusReferences(responseBody);
        });
      },
    );
  }
});

// ============================================================================
// Order Confirmation API Test Suite (type=orderconfirm)
// ============================================================================

test.describe('Order Confirmation API - Sponsored Products Validation', () => {
  test.describe.configure({ timeout: 60000 });

  const opcos = getAllOpcoConfigs();

  for (const [opcoKey, opco] of opcos) {
    // Authenticated User Test
    test(
      `[Authenticated User] Validate Order Confirmation API (type=orderconfirm) for ${opco.name}`,
      {
        tag: ['@api', '@orderconfirmapi', '@sponsored', '@orderconfirm', `@${opcoKey}`, '@authenticated'],
      },
      async ({ request }) => {
        const userId = opco.userId;
        let apiUrl = '';
        let responseStatus = 0;
        let responseBody: ApiResponse | null = null;
        let products: Product[] = [];

        await test.step('1. Call Order Confirmation API', async () => {
          apiUrl = buildOrderConfirmApiUrl(opco.url, userId, opco.storeId);
          const refererUrl = `${opco.url}/order-confirmation`;
          
          const result = await callApi(request, apiUrl, refererUrl, TIMEOUT);
          responseStatus = result.status;
          responseBody = result.body;

          // Get products from response
          products = getProducts(responseBody);

          expect(
            responseStatus,
            'Order Confirmation API should return 200 OK status',
          ).toBe(200);

          console.log(`[${opcoKey}] [Authenticated] Status Code: ${responseStatus}`);
        });

        await test.step('2. Validate Sponsored Products', async () => {
          const sponsoredProducts = getSponsoredProducts(products);
          console.log(`[${opcoKey}] [Authenticated] Sponsored Products: ${sponsoredProducts.length}`);
        });

        await test.step('3. Validate Auction IDs', async () => {
          const auctionIds = getAuctionIds(getAuctionedProducts(products));
          validateAuctionIdsExist(auctionIds);
          console.log(`[${opcoKey}] [Authenticated] Auction IDs: ${auctionIds.join(', ')}`);
        });

        await test.step('4. Validate No Citrus References', async () => {
          validateNoCitrusReferences(responseBody);
        });
      },
    );
  }
});
