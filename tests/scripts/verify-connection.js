/**
 * Simple Connection Verification
 * Quick test to verify Stop & Shop Delta environment access
 */

import axios from 'axios';

// Configuration
const OPCO = process.env.TEST_OPCO || 'stopandshop';
const ENV = process.env.TEST_ENV || 'delta';
const BASE_URL = `https://nonprd-${ENV}.${OPCO}.com/`;
const USER_AGENT = process.env.TEST_USER_AGENT || 'qa-reg-(pdl)-cua/05:01; +reg/18';

const OPCO_NAMES = {
  stopandshop: 'Stop & Shop',
  giantfood: 'Giant Food',
  foodlion: 'Food Lion',
  martinsfoods: "Martin's Foods",
  giantfoodstores: 'Giant Food Stores',
  hannaford: 'Hannaford',
};

async function verifyConnection() {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║         Environment Connection Verification             ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  console.log('📋 Configuration:');
  console.log(`   OPCO:        ${OPCO_NAMES[OPCO]} (${OPCO})`);
  console.log(`   Environment: ${ENV}`);
  console.log(`   Base URL:    ${BASE_URL}`);
  console.log(`   User Agent:  ${USER_AGENT.substring(0, 35)}...`);
  console.log('');

  const client = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'application/json, text/html, */*',
      'Accept-Encoding': 'gzip, deflate, br',
    },
  });

  // Test 1: Homepage
  console.log('🏠 Testing Homepage...');
  try {
    const startTime = Date.now();
    const response = await client.get('/');
    const duration = Date.now() - startTime;

    console.log(`   ✅ SUCCESS: Connected to ${OPCO_NAMES[OPCO]}`);
    console.log(`   📊 Status: ${response.status}`);
    console.log(`   ⏱️  Response Time: ${duration}ms`);
    console.log(`   📄 Content Type: ${response.headers['content-type']}`);
  } catch (error) {
    if (error.response) {
      console.log(`   ⚠️  Response: ${error.response.status} - ${error.response.statusText}`);
      if (error.response.status === 403) {
        console.log(`   🔒 Security Block Detected - Check User Agent`);
      } else if (error.response.status === 401) {
        console.log(`   🔑 Authentication Required`);
      }
    } else if (error.code === 'ENOTFOUND') {
      console.log(`   ❌ DNS Error: Cannot resolve ${BASE_URL}`);
      console.log(`   💡 Check if OPCO name is correct`);
    } else {
      console.log(`   ❌ ERROR: ${error.message}`);
    }
  }

  console.log('');

  // Test 2: Products API (if exists)
  console.log('🔍 Testing API Endpoint...');
  try {
    const startTime = Date.now();
    const response = await client.get('/api/products', { 
      params: { limit: 5 },
      validateStatus: () => true // Accept any status
    });
    const duration = Date.now() - startTime;

    if (response.status === 200) {
      console.log(`   ✅ SUCCESS: API Endpoint Accessible`);
      console.log(`   📊 Status: ${response.status}`);
      console.log(`   ⏱️  Response Time: ${duration}ms`);
    } else if (response.status === 404) {
      console.log(`   ℹ️  API Endpoint Not Found (404) - May not exist yet`);
    } else if (response.status === 403) {
      console.log(`   🔒 API Blocked (403) - Check User Agent Configuration`);
    } else {
      console.log(`   📊 Response: ${response.status}`);
    }
  } catch (error) {
    console.log(`   ℹ️  API endpoint test skipped: ${error.message}`);
  }

  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║                    Verification Complete                 ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  console.log('💡 Next Steps:');
  console.log(`   • URL to visit: ${BASE_URL}`);
  console.log('   • Run tests: npm run test:unit');
  console.log('   • Test different OPCO: TEST_OPCO=giantfood npm run verify');
  console.log('   • Test beta env: TEST_ENV=beta npm run verify\n');
}

// Run verification
verifyConnection().catch((error) => {
  console.error('\n❌ Verification failed:', error.message);
  process.exit(1);
});
