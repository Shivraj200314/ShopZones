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

    // Do not include tests themselves
    '!src/app/**/*.spec.ts',

    // Angular module files contain configuration,
    // not business logic
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