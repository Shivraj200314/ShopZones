module.exports = {

  preset: 'jest-preset-angular',

  setupFilesAfterEnv: [
    '<rootDir>/setup-jest.ts'
  ],

  testMatch: [
    '**/*.spec.ts'
  ],

  collectCoverageFrom: [

    'src/app/**/*.ts',

    // Exclude test files
    '!src/app/**/*.spec.ts',

    // Exclude Angular modules
    '!src/app/**/*.module.ts',

    // Exclude constants
    '!src/app/**/constants/*.ts'

  ],

  coverageDirectory: 'coverage',

  coverageReporters: [
    'text',
    'html',
    'lcov'
  ]

};