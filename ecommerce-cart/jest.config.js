module.exports = {

  preset: 'jest-preset-angular',

  setupFilesAfterEnv: [
    '<rootDir>/setup-jest.ts'
  ],

  testEnvironment: 'jsdom',

  testMatch: [
    '<rootDir>/src/**/*.spec.ts'
  ],

  collectCoverageFrom: [

    'src/app/**/*.ts',

    // Do not measure Jest test files
    '!src/app/**/*.spec.ts',

    // Do not measure Angular module configuration
    '!src/app/**/*.module.ts',

    '!src/main.ts'
  ],

  coverageDirectory: 'coverage',

  coverageReporters: [
    'text',
    'html',
    'lcov'
  ],

  clearMocks: true
};