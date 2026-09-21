module.exports = {

  preset: 'jest-preset-angular',

  setupFilesAfterEnv: [
    '<rootDir>/setup-jest.ts'
  ],

  testEnvironment: 'jsdom',

  moduleNameMapper: {

    // Absolute Angular imports:
    // src/app/...
    '^src/(.*)$':
      '<rootDir>/src/$1',

    // Module Federation Jest mock
    '^@angular-architects/module-federation$':
      '<rootDir>/src/test/mocks/module-federation.mock.ts'

  },

  testMatch: [
    '<rootDir>/src/**/*.spec.ts'
  ],

  collectCoverageFrom: [

    'src/app/**/*.ts',

    // Angular module configuration does not
    // need business-logic coverage
    '!src/app/**/*.module.ts',

    // Exclude spec files themselves
    '!src/app/**/*.spec.ts',

    '!src/main.ts'

  ],

  coverageDirectory:
    'coverage',

  coverageReporters: [
    'text',
    'html',
    'lcov'
  ],

  clearMocks:
    true

};