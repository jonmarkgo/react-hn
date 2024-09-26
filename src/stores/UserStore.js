// Mock UserStore.js

const UserStore = {
  getUserInfo: (id, callback) => {
    // Mock implementation
    const mockUser = {
      id: id,
      created: Date.now() / 1000,
      karma: 100,
      about: 'This is a mock user',
      submitted: [1, 2, 3],
    };
    setTimeout(() => callback(null, mockUser), 100);
  },

  addListener: (event, listener) => {
    // Mock implementation
    console.log(`Added listener for event: ${event}`);
  },

  removeListener: (event, listener) => {
    // Mock implementation
    console.log(`Removed listener for event: ${event}`);
  },
};

export default UserStore;
