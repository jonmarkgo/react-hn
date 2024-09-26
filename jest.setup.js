// jest.setup.js

// Define global variables used in the application
global.__VERSION__ = '1.0.0'; // You can set this to any appropriate version number

// Add any other global mocks or setup needed for your tests
require('@testing-library/jest-dom');

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;
