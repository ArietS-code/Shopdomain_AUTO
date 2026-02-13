<template>
  <div class="qa-dashboard">
    <h1 class="qa-title">Quality Check Dashboard</h1>
    
    <div class="qa-config">
      <h2>Configuration</h2>
      <div class="config-item">
        <strong>Target URL:</strong> {{ config.baseUrl }}
      </div>
      <div class="config-item">
        <strong>User Agent:</strong> <code>{{ config.userAgent }}</code>
      </div>
      <div class="config-item">
        <strong>Timeout:</strong> {{ config.timeout }}ms
      </div>
    </div>

    <div class="qa-actions">
      <button @click="runAllTests" :disabled="isRunning" class="qa-button primary">
        {{ isRunning ? 'Running Tests...' : 'Run All Tests' }}
      </button>
      <button @click="runUserJourney" :disabled="isRunning" class="qa-button secondary">
        Run Product Discovery Journey
      </button>
      <button @click="clearResults" class="qa-button tertiary">
        Clear Results
      </button>
    </div>

    <div v-if="isRunning" class="qa-loading">
      <div class="spinner"></div>
      <p>Running quality checks...</p>
    </div>

    <!-- Test Results -->
    <div v-if="testResults.length > 0" class="qa-results">
      <h2>Test Results</h2>
      <div class="results-summary">
        <div class="summary-item">
          <span class="label">Total Tests:</span>
          <span class="value">{{ testResults.length }}</span>
        </div>
        <div class="summary-item success">
          <span class="label">Passed:</span>
          <span class="value">{{ passedCount }}</span>
        </div>
        <div class="summary-item fail">
          <span class="label">Failed:</span>
          <span class="value">{{ failedCount }}</span>
        </div>
        <div class="summary-item">
          <span class="label">Success Rate:</span>
          <span class="value">{{ successRate }}%</span>
        </div>
      </div>

      <div class="test-list">
        <div
          v-for="(result, index) in testResults"
          :key="index"
          :class="['test-result-card', result.passed ? 'passed' : 'failed']"
        >
          <div class="test-header">
            <span class="test-status">{{ result.passed ? '✓' : '✗' }}</span>
            <h3 class="test-name">{{ result.testName }}</h3>
            <span class="test-duration">{{ result.duration }}ms</span>
          </div>
          <p class="test-message">{{ result.message }}</p>
          <div v-if="result.details" class="test-details">
            <button @click="toggleDetails(index)" class="details-toggle">
              {{ expandedTests.includes(index) ? 'Hide Details' : 'Show Details' }}
            </button>
            <pre v-if="expandedTests.includes(index)" class="details-content">{{
              JSON.stringify(result.details, null, 2)
            }}</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- User Journey Results -->
    <div v-if="journeyResults.length > 0" class="qa-journeys">
      <h2>User Journey Results</h2>
      <div
        v-for="(journey, index) in journeyResults"
        :key="index"
        :class="['journey-card', journey.overallPassed ? 'passed' : 'failed']"
      >
        <div class="journey-header">
          <span class="journey-status">{{ journey.overallPassed ? '✓' : '✗' }}</span>
          <h3 class="journey-name">{{ journey.journeyName }}</h3>
          <span class="journey-duration">{{ journey.totalDuration }}ms</span>
        </div>
        
        <div class="journey-steps">
          <div
            v-for="(step, stepIndex) in journey.steps"
            :key="stepIndex"
            :class="['journey-step', step.passed ? 'passed' : 'failed']"
          >
            <span class="step-number">{{ stepIndex + 1 }}</span>
            <span class="step-status">{{ step.passed ? '✓' : '✗' }}</span>
            <span class="step-name">{{ step.testName }}</span>
            <span class="step-duration">{{ step.duration }}ms</span>
            <p class="step-message">{{ step.message }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import QA_CONFIG from '@/config/qa.config';
import qaTestSuite from '@/services/qa-test-suite';
import type { TestResult, UserJourneyResult } from '@/services/qa-test-suite';

export default defineComponent({
  name: 'QualityCheckView',
  data() {
    return {
      config: QA_CONFIG,
      isRunning: false,
      testResults: [] as TestResult[],
      journeyResults: [] as UserJourneyResult[],
      expandedTests: [] as number[],
    };
  },
  computed: {
    passedCount(): number {
      return this.testResults.filter((r) => r.passed).length;
    },
    failedCount(): number {
      return this.testResults.filter((r) => !r.passed).length;
    },
    successRate(): number {
      if (this.testResults.length === 0) return 0;
      return Math.round((this.passedCount / this.testResults.length) * 100);
    },
  },
  methods: {
    async runAllTests() {
      this.isRunning = true;
      this.testResults = [];
      try {
        this.testResults = await qaTestSuite.runAllTests();
      } catch (error: any) {
        console.error('Error running tests:', error);
        alert(`Error running tests: ${error.message}`);
      } finally {
        this.isRunning = false;
      }
    },
    async runUserJourney() {
      this.isRunning = true;
      this.journeyResults = [];
      try {
        const result = await qaTestSuite.runProductDiscoveryJourney();
        this.journeyResults.push(result);
      } catch (error: any) {
        console.error('Error running user journey:', error);
        alert(`Error running user journey: ${error.message}`);
      } finally {
        this.isRunning = false;
      }
    },
    clearResults() {
      this.testResults = [];
      this.journeyResults = [];
      this.expandedTests = [];
    },
    toggleDetails(index: number) {
      const idx = this.expandedTests.indexOf(index);
      if (idx > -1) {
        this.expandedTests.splice(idx, 1);
      } else {
        this.expandedTests.push(index);
      }
    },
  },
});
</script>

<style scoped lang="scss">
.qa-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

.qa-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--spacing-xl);
  color: var(--color-text);
}

.qa-config {
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-xl);
  box-shadow: var(--shadow-sm);

  h2 {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-md);
  }

  .config-item {
    margin-bottom: var(--spacing-sm);
    
    code {
      background: #f5f5f5;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: monospace;
      font-size: 13px;
    }
  }
}

.qa-actions {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.qa-button {
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  border-radius: var(--radius-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast);

  &.primary {
    background-color: #e61e50;
    color: white;

    &:hover:not(:disabled) {
      background-color: #c91847;
    }
  }

  &.secondary {
    background-color: var(--color-primary);
    color: white;

    &:hover:not(:disabled) {
      background-color: var(--color-primary-dark);
    }
  }

  &.tertiary {
    background-color: #f5f5f5;
    color: var(--color-text);

    &:hover {
      background-color: #e5e5e5;
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.qa-loading {
  text-align: center;
  padding: var(--spacing-2xl);

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #e61e50;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto var(--spacing-md);
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.qa-results,
.qa-journeys {
  margin-bottom: var(--spacing-xl);

  h2 {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-lg);
  }
}

.results-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);

  .summary-item {
    background: white;
    padding: var(--spacing-md);
    border-radius: var(--radius-sm);
    box-shadow: var(--shadow-sm);

    &.success {
      border-left: 4px solid #4caf50;
    }

    &.fail {
      border-left: 4px solid #f44336;
    }

    .label {
      display: block;
      font-size: 14px;
      color: var(--color-text-light);
      margin-bottom: 4px;
    }

    .value {
      display: block;
      font-size: 24px;
      font-weight: var(--font-weight-bold);
    }
  }
}

.test-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.test-result-card {
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  border-left: 4px solid;

  &.passed {
    border-color: #4caf50;
  }

  &.failed {
    border-color: #f44336;
  }

  .test-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-sm);

    .test-status {
      font-size: 24px;
      font-weight: bold;
    }

    .test-name {
      flex: 1;
      font-size: var(--font-size-lg);
      margin: 0;
    }

    .test-duration {
      color: var(--color-text-light);
      font-size: 14px;
    }
  }

  .test-message {
    margin: var(--spacing-sm) 0;
    color: var(--color-text);
  }

  .test-details {
    margin-top: var(--spacing-md);

    .details-toggle {
      background: #f5f5f5;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;

      &:hover {
        background: #e5e5e5;
      }
    }

    .details-content {
      margin-top: var(--spacing-sm);
      background: #f5f5f5;
      padding: var(--spacing-md);
      border-radius: 4px;
      overflow-x: auto;
      font-size: 12px;
    }
  }
}

.journey-card {
  background: white;
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  margin-bottom: var(--spacing-lg);
  border-left: 4px solid;

  &.passed {
    border-color: #4caf50;
  }

  &.failed {
    border-color: #f44336;
  }

  .journey-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);

    .journey-status {
      font-size: 28px;
      font-weight: bold;
    }

    .journey-name {
      flex: 1;
      font-size: var(--font-size-xl);
      margin: 0;
    }

    .journey-duration {
      color: var(--color-text-light);
      font-weight: var(--font-weight-medium);
    }
  }

  .journey-steps {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .journey-step {
    display: grid;
    grid-template-columns: auto auto 1fr auto;
    gap: var(--spacing-md);
    align-items: center;
    padding: var(--spacing-md);
    background: #f9f9f9;
    border-radius: var(--radius-sm);
    border-left: 3px solid;

    &.passed {
      border-color: #4caf50;
    }

    &.failed {
      border-color: #f44336;
    }

    .step-number {
      width: 24px;
      height: 24px;
      background: var(--color-primary);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
    }

    .step-status {
      font-size: 18px;
      font-weight: bold;
    }

    .step-name {
      font-weight: var(--font-weight-medium);
    }

    .step-duration {
      color: var(--color-text-light);
      font-size: 14px;
    }

    .step-message {
      grid-column: 2 / -1;
      margin: var(--spacing-sm) 0 0;
      font-size: 14px;
      color: var(--color-text-light);
    }
  }
}
</style>
