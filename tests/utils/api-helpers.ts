/**
 * Common API Helper Functions
 * Shared utilities for API testing across different endpoints
 * 
 * Purpose:
 *   - Centralize common API functions
 *   - Follow DRY principle
 *   - Improve code maintainability
 */

import { type APIRequestContext } from '@playwright/test';
import { expect } from '@playwright/test';

// ============================================================================
// Type Definitions
// ============================================================================

export type Product = {
  prodId?: number;
  name?: string;
  sponsored?: boolean;
  auctioned?: boolean;
  sponsoredProductInfo?: {
    auctionId?: string;
  };
  [key: string]: any;
};

export type ApiResponse = {
  response?: {
    products?: Product[];
    [key: string]: any;
  };
  products?: Product[];
  [key: string]: any;
};

// ============================================================================
// API Call Functions
// ============================================================================

/**
 * Makes a direct API call with standard headers
 * @param request - Playwright APIRequestContext
 * @param url - Full API URL with query parameters
 * @param refererUrl - Referer URL for the request
 * @param timeout - Request timeout in milliseconds (default: 30000)
 * @returns Status code and response body
 */
export async function callApi(
  request: APIRequestContext,
  url: string,
  refererUrl: string,
  timeout: number = 30000,
): Promise<{ status: number; body: ApiResponse | null }> {
  try {
    const response = await request.get(url, {
      headers: {
        'accept': 'application/json, text/plain, */*',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'no-cache',
        'pragma': 'no-cache',
        'referer': refererUrl,
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'qa-reg-(pdl)-cua/05:01; +reg/18',
      },
      timeout,
    });
    
    const status = response.status();
    let body = null;
    
    try {
      body = await response.json();
    } catch {
      console.log('⚠️  Response is not valid JSON');
    }
    
    return { status, body };
  } catch (error) {
    console.error(`API call failed: ${error}`);
    throw error;
  }
}

// ============================================================================
// Product Extraction Functions
// ============================================================================

/**
 * Gets products array from API response (handles nested response structures)
 * @param responseBody - API response body
 * @returns Array of products
 */
export function getProducts(responseBody: ApiResponse | null): Product[] {
  if (!responseBody) {
    return [];
  }
  
  // Check if products are nested under 'response' key
  const products = responseBody.response?.products || responseBody.products;
  
  return products || [];
}

/**
 * Gets sponsored products from products array
 * Sponsored products have sponsored=true OR sponsoredProductInfo property
 * @param products - Array of products
 * @returns Array of sponsored products
 */
export function getSponsoredProducts(products: Product[]): Product[] {
  return products.filter((product) => 
    product.sponsored === true || 
    product.sponsoredProductInfo !== undefined
  );
}

/**
 * Gets auctioned products from products array
 * Auctioned products have auctioned=true OR sponsoredProductInfo with auctionId
 * @param products - Array of products
 * @returns Array of auctioned products
 */
export function getAuctionedProducts(products: Product[]): Product[] {
  return products.filter((product) => 
    product.auctioned === true || 
    product.sponsoredProductInfo !== undefined
  );
}

/**
 * Extracts unique auction IDs from products
 * @param products - Array of products
 * @returns Array of unique auction IDs
 */
export function getAuctionIds(products: Product[]): string[] {
  const auctionIds = products
    .map(p => p.sponsoredProductInfo?.auctionId)
    .filter(Boolean) as string[];
  
  return [...new Set(auctionIds)];
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validates no Citrus references exist in the response (post-deprecation check)
 * @param responseBody - API response body
 * @throws Assertion error if Citrus references found
 */
export function validateNoCitrusReferences(responseBody: ApiResponse | null): void {
  if (!responseBody) {
    return;
  }

  const responseStr = JSON.stringify(responseBody).toLowerCase();
  const hasCitrusReference = responseStr.includes('citrus');

  expect(
    hasCitrusReference,
    'Response should not contain "citrus" references (deprecated)',
  ).toBe(false);
}

/**
 * Validates API response status code
 * @param status - HTTP status code
 * @param expectedStatus - Expected HTTP status code (default: 200)
 * @param message - Custom error message
 */
export function validateStatusCode(
  status: number, 
  expectedStatus: number = 200, 
  message?: string
): void {
  expect(
    status,
    message || `API should return ${expectedStatus} status`,
  ).toBe(expectedStatus);
}

/**
 * Validates that products array is not empty
 * @param products - Array of products
 * @param message - Custom error message
 */
export function validateProductsExist(products: Product[], message?: string): void {
  expect(
    products.length,
    message || 'Products array should not be empty',
  ).toBeGreaterThan(0);
}

/**
 * Validates that sponsored products exist in array
 * @param sponsoredProducts - Array of sponsored products
 * @param message - Custom error message
 */
export function validateSponsoredProductsExist(sponsoredProducts: Product[], message?: string): void {
  expect(
    sponsoredProducts.length,
    message || 'Should have sponsored products',
  ).toBeGreaterThan(0);
}

/**
 * Validates that auction IDs exist
 * @param auctionIds - Array of auction IDs
 * @param message - Custom error message
 */
export function validateAuctionIdsExist(auctionIds: string[], message?: string): void {
  expect(
    auctionIds.length,
    message || 'Should have auction IDs',
  ).toBeGreaterThan(0);
}
