module.exports = {
  preset: 'jest-preset-angular',

  setupFilesAfterEnv: [
    '<rootDir>/setup-jest.ts'
  ],

  globalSetup: 'jest-preset-angular/global-setup',

  moduleFileExtensions: [
    'ts',
    'html',
    'js',
    'json',
    'mjs'
  ],

  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$)'
  ],

  moduleNameMapper: {
  '^src/(.*)$': '<rootDir>/src/$1'
},

  testMatch: [
    '<rootDir>/src/**/*.spec.ts'
  ],

  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.module.ts',
    '!src/main.ts'
  ],

  coverageDirectory: 'coverage',

  coverageReporters: [
    'html',
    'text',
    'lcov'
  ]
};