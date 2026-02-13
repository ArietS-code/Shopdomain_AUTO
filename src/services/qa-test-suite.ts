import qaApiService from './qa-api.service';

export interface TestResult {
  testName: string;
  passed: boolean;
  duration: number;
  message: string;
  details?: any;
}

export interface UserJourneyResult {
  journeyName: string;
  steps: TestResult[];
  overallPassed: boolean;
  totalDuration: number;
}

/**
 * QA Test Suite for validating user journeys
 */
class QATestSuite {
  /**
   * Test: Homepage loads successfully
   */
  async testHomepageLoad(): Promise<TestResult> {
    const startTime = Date.now();
    try {
      const result = await qaApiService.testPageLoad('/');
      const duration = Date.now() - startTime;

      return {
        testName: 'Homepage Load',
        passed: result.success && result.status === 200,
        duration,
        message: result.success
          ? `Homepage loaded in ${result.responseTime}ms (${result.contentLength} bytes)`
          : `Failed: ${result.error}`,
        details: result,
      };
    } catch (error: any) {
      return {
        testName: 'Homepage Load',
        passed: false,
        duration: Date.now() - startTime,
        message: `Error: ${error.message}`,
      };
    }
  }

  /**
   * Test: Product search functionality
   */
  async testProductSearch(query: string): Promise<TestResult> {
    const startTime = Date.now();
    try {
      const result = await qaApiService.testProductSearch(query);
      const duration = Date.now() - startTime;

      return {
        testName: `Product Search: "${query}"`,
        passed: result.success && result.productsFound > 0,
        duration,
        message: result.success
          ? `Found ${result.productsFound} products in ${result.responseTime}ms`
          : `Failed: ${result.error}`,
        details: result,
      };
    } catch (error: any) {
      return {
        testName: `Product Search: "${query}"`,
        passed: false,
        duration: Date.now() - startTime,
        message: `Error: ${error.message}`,
      };
    }
  }

  /**
   * Test: API endpoint availability
   */
  async testEndpointAvailability(path: string, expectedStatus = 200): Promise<TestResult> {
    const startTime = Date.now();
    try {
      const result = await qaApiService.testEndpoint(path);
      const duration = Date.now() - startTime;

      return {
        testName: `Endpoint: ${path}`,
        passed: result.status === expectedStatus,
        duration,
        message: result.success
          ? `Status ${result.status} - Response time: ${result.responseTime}ms`
          : `Failed with status ${result.status}: ${result.error}`,
        details: result,
      };
    } catch (error: any) {
      return {
        testName: `Endpoint: ${path}`,
        passed: false,
        duration: Date.now() - startTime,
        message: `Error: ${error.message}`,
      };
    }
  }

  /**
   * User Journey: Product Discovery and Purchase Flow
   */
  async runProductDiscoveryJourney(): Promise<UserJourneyResult> {
    const startTime = Date.now();
    const steps: TestResult[] = [];

    // Step 1: Load homepage
    steps.push(await this.testHomepageLoad());

    // Step 2: Search for products
    steps.push(await this.testProductSearch('milk'));

    // Step 3: Check product listing page
    steps.push(await this.testEndpointAvailability('/products'));

    // Step 4: Check cart functionality
    steps.push(await this.testEndpointAvailability('/cart'));

    const totalDuration = Date.now() - startTime;
    const overallPassed = steps.every((step) => step.passed);

    return {
      journeyName: 'Product Discovery Journey',
      steps,
      overallPassed,
      totalDuration,
    };
  }

  /**
   * User Journey: Search and View Product Details
   */
  async runSearchToDetailsJourney(searchQuery: string): Promise<UserJourneyResult> {
    const startTime = Date.now();
    const steps: TestResult[] = [];

    // Step 1: Search for product
    steps.push(await this.testProductSearch(searchQuery));

    // Step 2: Load product details (assuming first result)
    steps.push(await this.testEndpointAvailability('/product-details'));

    const totalDuration = Date.now() - startTime;
    const overallPassed = steps.every((step) => step.passed);

    return {
      journeyName: `Search to Details: "${searchQuery}"`,
      steps,
      overallPassed,
      totalDuration,
    };
  }

  /**
   * Run all critical tests
   */
  async runAllTests(): Promise<TestResult[]> {
    const tests: TestResult[] = [];

    tests.push(await this.testHomepageLoad());
    tests.push(await this.testProductSearch('banana'));
    tests.push(await this.testProductSearch('milk'));
    tests.push(await this.testEndpointAvailability('/'));
    tests.push(await this.testEndpointAvailability('/products'));

    return tests;
  }
}

export default new QATestSuite();
