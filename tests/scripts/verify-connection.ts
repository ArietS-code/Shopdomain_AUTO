/**
 * Verify Connection Script
 * Tests connection to the configured OPCO and environment
 */

import { ProductsApi } from '../api/ProductsApi';
import { CartApi } from '../api/CartApi';
import TEST_CONFIG, { getOpcoDisplayName, logUserAgentConfig } from '../config/test.config';

async function verifyConnection() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║         Environment Connection Verification             ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  // Display configuration
  console.log('📋 Configuration:');
  console.log(`   OPCO:        ${getOpcoDisplayName(TEST_CONFIG.opco)} (${TEST_CONFIG.opco})`);
  console.log(`   Environment: ${TEST_CONFIG.environment}`);
  console.log(`   Base URL:    ${TEST_CONFIG.baseUrl}`);
  console.log(`   User Agent:  ${TEST_CONFIG.qaUserAgent.substring(0, 30)}...`);
  console.log('');

  // Test Products API
  console.log('🔍 Testing Products API...');
  const productsApi = new ProductsApi(TEST_CONFIG.baseUrl);
  
  try {
    const startTime = Date.now();
    const response = await productsApi.getAllProducts({ limit: 5 });
    const duration = Date.now() - startTime;

    if (response.success) {
      console.log(`   ✅ SUCCESS: Connected to Products API`);
      console.log(`   📊 Status: ${response.status}`);
      console.log(`   ⏱️  Response Time: ${response.responseTime}ms`);
      console.log(`   📦 Products Found: ${response.data?.length || 0}`);
    } else {
      console.log(`   ❌ FAILED: ${response.status} - ${response.error}`);
      console.log(`   ⏱️  Response Time: ${response.responseTime}ms`);
    }
  } catch (error: any) {
    console.log(`   ❌ ERROR: ${error.message}`);
  }

  console.log('');

  // Test Cart API
  console.log('🛒 Testing Cart API...');
  const cartApi = new CartApi(TEST_CONFIG.baseUrl);
  
  try {
    const response = await cartApi.getCart();

    if (response.success) {
      console.log(`   ✅ SUCCESS: Connected to Cart API`);
      console.log(`   📊 Status: ${response.status}`);
      console.log(`   ⏱️  Response Time: ${response.responseTime}ms`);
    } else {
      console.log(`   ❌ FAILED: ${response.status} - ${response.error}`);
      console.log(`   ⏱️  Response Time: ${response.responseTime}ms`);
    }
  } catch (error: any) {
    console.log(`   ❌ ERROR: ${error.message}`);
  }

  console.log('');

  // Test Search API
  console.log('🔎 Testing Search API...');
  try {
    const response = await productsApi.searchProducts('milk', { limit: 5 });

    if (response.success) {
      console.log(`   ✅ SUCCESS: Search endpoint working`);
      console.log(`   📊 Status: ${response.status}`);
      console.log(`   ⏱️  Response Time: ${response.responseTime}ms`);
      console.log(`   🔍 Results: ${response.data?.length || 0}`);
    } else {
      console.log(`   ❌ FAILED: ${response.status} - ${response.error}`);
    }
  } catch (error: any) {
    console.log(`   ❌ ERROR: ${error.message}`);
  }

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║                    Verification Complete                 ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  console.log('💡 Tips:');
  console.log('   • If you see 403/401 errors, check your user agent');
  console.log('   • If you see connection errors, verify the URL');
  console.log('   • Run tests with: npm run test:unit');
  console.log('   • Change OPCO with: TEST_OPCO=giantfood npm run verify');
  console.log('   • Change ENV with: TEST_ENV=beta npm run verify\n');
}

// Run verification
verifyConnection().catch((error) => {
  console.error('\n❌ Verification failed:', error.message);
  process.exit(1);
});
