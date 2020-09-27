module.exports = {
  preset                : 'ts-jest',
  testEnvironment       : 'node',
  verbose               : true,
  modulePaths           : [ '<rootDir>/src/' ],
  testPathIgnorePatterns: [ '<rootDir>/dist/', '<rootDir>/node_modules/', ]
};
