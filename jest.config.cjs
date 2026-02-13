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
  setupFilesAfterEnv: [
    '<rootDir>/tests/setup/jest.setup.ts',
    '<rootDir>/tests/setup/custom-matchers.ts'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,vue}',
    '!src/main.ts',
    '!src/**/*.d.ts'
  ],
  coverageThreshold: {
    global: {
      lines: 80,
      statements: 80
    }
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/mocks/'
  ]
};
