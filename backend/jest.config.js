module.exports = {
  preset: "@shelf/jest-mongodb",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "**/*.{js,jsx}",
    "!**/node_modules/**",
    "!**/coverage/**",
    "!**/tests/**",
  ],
  testPathIgnorePatterns: ["/node_modules/"],
  verbose: true,
};
