/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  collectCoverageFrom: [
    'src/components/**/*.{ts,tsx}',
    'src/pages/**/*.{ts,tsx}',
    'src/util/utils.ts',
    'src/util/ColorSchemeToggle.tsx',
    'src/App.tsx'
  ],
  coverageThreshold: {
    global: {
      lines: 75
    }
  }
};
