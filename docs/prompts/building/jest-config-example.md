```js
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(vue)$': '@vue/vue3-jest',
    '^.+\\.(ts|js)$': 'ts-jest'
  },
  // Treat Vue SFC + TS as ESM for ts-jest
  extensionsToTreatAsEsm: ['.ts', '.vue'],
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: { esModuleInterop: true }
    }
  },
  moduleFileExtensions: ['vue', 'ts', 'js', 'json'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // Force CJS build of test utils to avoid needing global Vue
    '^@vue/test-utils$': '<rootDir>/node_modules/@vue/test-utils/dist/vue-test-utils.cjs.js'
  },
  testMatch: ['**/*.spec.(ts|js)'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,vue}',
    '!src/main.ts'
  ],
  coverageThreshold: {
    global: {
      lines: {{coverage_target_lines}},
      statements: {{coverage_target_lines}}
    }
  }
};
```