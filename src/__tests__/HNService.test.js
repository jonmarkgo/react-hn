import HNService from '../services/HNService';
import { getDatabase, ref, get, child } from 'firebase/database';

// Mock Firebase
jest.mock('firebase/database', () => ({
  getDatabase: jest.fn(),
  ref: jest.fn(),
  get: jest.fn(),
  child: jest.fn()
}));

describe('HNService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('fetchItem', () => {
    it('should fetch item data from Firebase', async () => {
      const mockSnapshot = {
        val: jest.fn().mockReturnValue({ id: 1, title: 'Test Item' })
      };
      get.mockResolvedValue(mockSnapshot);

      const callback = jest.fn();
      await HNService.fetchItem(1, callback);

      expect(child).toHaveBeenCalledWith(expect.anything(), 'item/1');
      expect(get).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith({ id: 1, title: 'Test Item' });
    });
  });

  describe('fetchItems', () => {
    it('should fetch multiple items', async () => {
      const mockItems = [
        { id: 1, title: 'Item 1' },
        { id: 2, title: 'Item 2' }
      ];
      jest.spyOn(HNService, 'fetchItem').mockImplementation((id, cb) => {
        cb(mockItems.find(item => item.id === id));
      });

      const callback = jest.fn();
      await HNService.fetchItems([1, 2], callback);

      expect(HNService.fetchItem).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(mockItems);
    });
  });

  describe('storiesRef', () => {
    it('should return a reference to the stories path', () => {
      HNService.storiesRef('top');
      expect(child).toHaveBeenCalledWith(expect.anything(), 'top');
    });
  });

  describe('itemRef', () => {
    it('should return a reference to the item path', () => {
      HNService.itemRef(1);
      expect(child).toHaveBeenCalledWith(expect.anything(), 'item/1');
    });
  });

  describe('userRef', () => {
    it('should return a reference to the user path', () => {
      HNService.userRef('testuser');
      expect(child).toHaveBeenCalledWith(expect.anything(), 'user/testuser');
    });
  });

  describe('updatesRef', () => {
    it('should return a reference to the updates path', () => {
      HNService.updatesRef();
      expect(child).toHaveBeenCalledWith(expect.anything(), 'updates/items');
    });
  });
});
