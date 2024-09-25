module.exports = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!react-router)',
  ],
  moduleFileExtensions: ['js', 'jsx'],
  testEnvironment: 'jsdom',
};
