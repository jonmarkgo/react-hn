import { getItem, setItem, removeItem } from '../utils/storage';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('storage utility', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('setItem', () => {
    it('should store a string value', () => {
      setItem('testKey', 'testValue');
      expect(localStorage.setItem).toHaveBeenCalledWith('testKey', JSON.stringify('testValue'));
    });

    it('should store an object value', () => {
      const testObject = { name: 'John', age: 30 };
      setItem('testKey', testObject);
      expect(localStorage.setItem).toHaveBeenCalledWith('testKey', JSON.stringify(testObject));
    });

    it('should store an array value', () => {
      const testArray = [1, 2, 3];
      setItem('testKey', testArray);
      expect(localStorage.setItem).toHaveBeenCalledWith('testKey', JSON.stringify(testArray));
    });

    it('should handle null values', () => {
      setItem('testKey', null);
      expect(localStorage.setItem).toHaveBeenCalledWith('testKey', JSON.stringify(null));
    });

    it('should handle undefined values', () => {
      setItem('testKey', undefined);
      expect(localStorage.setItem).toHaveBeenCalledWith('testKey', JSON.stringify(undefined));
    });
  });

  describe('getItem', () => {
    it('should retrieve a stored string value', () => {
      localStorage.getItem.mockReturnValue(JSON.stringify('testValue'));
      expect(getItem('testKey')).toBe('testValue');
    });

    it('should retrieve a stored object value', () => {
      const testObject = { name: 'John', age: 30 };
      localStorage.getItem.mockReturnValue(JSON.stringify(testObject));
      expect(getItem('testKey')).toEqual(testObject);
    });

    it('should retrieve a stored array value', () => {
      const testArray = [1, 2, 3];
      localStorage.getItem.mockReturnValue(JSON.stringify(testArray));
      expect(getItem('testKey')).toEqual(testArray);
    });

    it('should return null for non-existent keys', () => {
      localStorage.getItem.mockReturnValue(null);
      expect(getItem('nonExistentKey')).toBeNull();
    });

    it('should handle invalid JSON', () => {
      localStorage.getItem.mockReturnValue('invalidJSON');
      expect(getItem('testKey')).toBeNull();
    });
  });

  describe('removeItem', () => {
    it('should remove a stored item', () => {
      removeItem('testKey');
      expect(localStorage.removeItem).toHaveBeenCalledWith('testKey');
    });

    it('should not throw an error when removing a non-existent item', () => {
      expect(() => removeItem('nonExistentKey')).not.toThrow();
    });
  });

  describe('error handling', () => {
    it('should handle localStorage being unavailable', () => {
      const originalLocalStorage = global.localStorage;
      delete global.localStorage;

      expect(() => setItem('testKey', 'testValue')).not.toThrow();
      expect(() => getItem('testKey')).not.toThrow();
      expect(() => removeItem('testKey')).not.toThrow();

      global.localStorage = originalLocalStorage;
    });

    it('should handle quota exceeded error', () => {
      localStorage.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      expect(() => setItem('testKey', 'testValue')).not.toThrow();

      localStorage.setItem.mockRestore();
    });
  });
});
