module.exports = {

  preset: 'jest-preset-angular',

  setupFilesAfterEnv: [
    '<rootDir>/setup-jest.ts'
  ],

  testEnvironment: 'jsdom',

  moduleNameMapper: {

    '^src/(.*)$':
      '<rootDir>/src/$1',

    '^@angular-architects/module-federation$':
      '<rootDir>/src/test/mocks/module-federation.mock.ts'
  },

  testMatch: [
    '<rootDir>/src/**/*.spec.ts'
  ],

  collectCoverageFrom: [

    'src/app/**/*.ts',

    '!src/app/**/*.spec.ts',

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