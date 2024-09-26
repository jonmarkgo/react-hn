import ItemStore from '../stores/ItemStore';
import { fetchAPI } from '../services/HNService';

jest.mock('../services/HNService');

describe('ItemStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    ItemStore.reset();
  });

  describe('getItem', () => {
    it('should return an item from the cache', () => {
      const item = { id: 1, title: 'Test Item' };
      ItemStore.setItem(item);
      expect(ItemStore.getItem(1)).toEqual(item);
    });

    it('should return undefined for non-existent item', () => {
      expect(ItemStore.getItem(999)).toBeUndefined();
    });
  });

  describe('setItem', () => {
    it('should add an item to the cache', () => {
      const item = { id: 1, title: 'Test Item' };
      ItemStore.setItem(item);
      expect(ItemStore.getItem(1)).toEqual(item);
    });

    it('should trigger change event when adding a new item', () => {
      const listener = jest.fn();
      ItemStore.addListener('change', listener);

      const item = { id: 1, title: 'Test Item' };
      ItemStore.setItem(item);

      expect(listener).toHaveBeenCalled();
    });
  });

  describe('fetchItem', () => {
    it('should fetch an item from the API', async () => {
      const item = { id: 1, title: 'Test Item' };
      fetchAPI.mockResolvedValue(item);

      await ItemStore.fetchItem(1);

      expect(fetchAPI).toHaveBeenCalledWith('item/1');
      expect(ItemStore.getItem(1)).toEqual(item);
    });

    it('should handle errors when fetching an item', async () => {
      const error = new Error('Failed to fetch');
      fetchAPI.mockRejectedValue(error);

      await expect(ItemStore.fetchItem(1)).rejects.toThrow('Failed to fetch');
    });
  });

  describe('fetchItems', () => {
    it('should fetch multiple items from the API', async () => {
      const items = [
        { id: 1, title: 'Test Item 1' },
        { id: 2, title: 'Test Item 2' },
      ];
      fetchAPI.mockResolvedValueOnce(items[0]).mockResolvedValueOnce(items[1]);

      await ItemStore.fetchItems([1, 2]);

      expect(fetchAPI).toHaveBeenCalledTimes(2);
      expect(fetchAPI).toHaveBeenCalledWith('item/1');
      expect(fetchAPI).toHaveBeenCalledWith('item/2');
      expect(ItemStore.getItem(1)).toEqual(items[0]);
      expect(ItemStore.getItem(2)).toEqual(items[1]);
    });
  });

  describe('addListener and removeListener', () => {
    it('should add and remove change listeners', () => {
      const listener = jest.fn();

      ItemStore.addListener('change', listener);
      ItemStore.setItem({ id: 1, title: 'Test Item' });
      expect(listener).toHaveBeenCalledTimes(1);

      ItemStore.removeListener('change', listener);
      ItemStore.setItem({ id: 2, title: 'Another Item' });
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('reset', () => {
    it('should clear the cache and listeners', () => {
      const item = { id: 1, title: 'Test Item' };
      ItemStore.setItem(item);
      const listener = jest.fn();
      ItemStore.addListener('change', listener);

      ItemStore.reset();

      expect(ItemStore.getItem(1)).toBeUndefined();
      ItemStore.setItem({ id: 2, title: 'Another Item' });
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('getItems', () => {
    it('should return multiple items', () => {
      const items = [
        { id: 1, title: 'Test Item 1' },
        { id: 2, title: 'Test Item 2' },
      ];
      ItemStore.setItem(items[0]);
      ItemStore.setItem(items[1]);

      const result = ItemStore.getItems([1, 2]);

      expect(result).toEqual(items);
    });

    it('should return undefined for non-existent items', () => {
      const result = ItemStore.getItems([1, 2]);

      expect(result).toEqual([undefined, undefined]);
    });
  });

  describe('getAllItems', () => {
    it('should return all items in the cache', () => {
      const items = [
        { id: 1, title: 'Test Item 1' },
        { id: 2, title: 'Test Item 2' },
      ];
      ItemStore.setItem(items[0]);
      ItemStore.setItem(items[1]);

      const result = ItemStore.getAllItems();

      expect(result).toEqual(items);
    });

    it('should return an empty array when cache is empty', () => {
      const result = ItemStore.getAllItems();

      expect(result).toEqual([]);
    });
  });
});
