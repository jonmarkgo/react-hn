import UpdatesStore from '../stores/UpdatesStore';
import { fetchAPI } from '../services/HNService';

jest.mock('../services/HNService');

describe('UpdatesStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    UpdatesStore.reset();
  });

  describe('getUpdates', () => {
    it('should return updates from the cache', () => {
      const updates = { items: [1, 2, 3], profiles: ['user1', 'user2'] };
      UpdatesStore.setUpdates(updates);
      expect(UpdatesStore.getUpdates()).toEqual(updates);
    });

    it('should return null if no updates are cached', () => {
      expect(UpdatesStore.getUpdates()).toBeNull();
    });
  });

  describe('setUpdates', () => {
    it('should set updates in the cache', () => {
      const updates = { items: [1, 2, 3], profiles: ['user1', 'user2'] };
      UpdatesStore.setUpdates(updates);
      expect(UpdatesStore.getUpdates()).toEqual(updates);
    });

    it('should trigger change event when setting updates', () => {
      const listener = jest.fn();
      UpdatesStore.addListener('change', listener);

      const updates = { items: [1, 2, 3], profiles: ['user1', 'user2'] };
      UpdatesStore.setUpdates(updates);

      expect(listener).toHaveBeenCalled();
    });
  });

  describe('fetchUpdates', () => {
    it('should fetch updates from the API', async () => {
      const updates = { items: [1, 2, 3], profiles: ['user1', 'user2'] };
      fetchAPI.mockResolvedValue(updates);

      await UpdatesStore.fetchUpdates();

      expect(fetchAPI).toHaveBeenCalledWith('updates');
      expect(UpdatesStore.getUpdates()).toEqual(updates);
    });

    it('should handle errors when fetching updates', async () => {
      const error = new Error('Failed to fetch');
      fetchAPI.mockRejectedValue(error);

      await expect(UpdatesStore.fetchUpdates()).rejects.toThrow('Failed to fetch');
    });
  });

  describe('addListener and removeListener', () => {
    it('should add and remove change listeners', () => {
      const listener = jest.fn();

      UpdatesStore.addListener('change', listener);
      UpdatesStore.setUpdates({ items: [1, 2, 3], profiles: ['user1', 'user2'] });
      expect(listener).toHaveBeenCalledTimes(1);

      UpdatesStore.removeListener('change', listener);
      UpdatesStore.setUpdates({ items: [4, 5, 6], profiles: ['user3', 'user4'] });
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('reset', () => {
    it('should clear the cache and listeners', () => {
      const updates = { items: [1, 2, 3], profiles: ['user1', 'user2'] };
      UpdatesStore.setUpdates(updates);
      const listener = jest.fn();
      UpdatesStore.addListener('change', listener);

      UpdatesStore.reset();

      expect(UpdatesStore.getUpdates()).toBeNull();
      UpdatesStore.setUpdates({ items: [4, 5, 6], profiles: ['user3', 'user4'] });
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('getItem', () => {
    it('should return an item from the updates', () => {
      const updates = { items: [{ id: 1, title: 'Item 1' }, { id: 2, title: 'Item 2' }] };
      UpdatesStore.setUpdates(updates);
      expect(UpdatesStore.getItem(1)).toEqual({ id: 1, title: 'Item 1' });
    });

    it('should return undefined for non-existent item', () => {
      const updates = { items: [{ id: 1, title: 'Item 1' }] };
      UpdatesStore.setUpdates(updates);
      expect(UpdatesStore.getItem(2)).toBeUndefined();
    });
  });

  describe('getItems', () => {
    it('should return multiple items from the updates', () => {
      const updates = { items: [{ id: 1, title: 'Item 1' }, { id: 2, title: 'Item 2' }] };
      UpdatesStore.setUpdates(updates);
      expect(UpdatesStore.getItems([1, 2])).toEqual([
        { id: 1, title: 'Item 1' },
        { id: 2, title: 'Item 2' }
      ]);
    });

    it('should return undefined for non-existent items', () => {
      const updates = { items: [{ id: 1, title: 'Item 1' }] };
      UpdatesStore.setUpdates(updates);
      expect(UpdatesStore.getItems([1, 2])).toEqual([{ id: 1, title: 'Item 1' }, undefined]);
    });
  });

  describe('getProfile', () => {
    it('should return a profile from the updates', () => {
      const updates = { profiles: [{ id: 'user1', karma: 100 }, { id: 'user2', karma: 200 }] };
      UpdatesStore.setUpdates(updates);
      expect(UpdatesStore.getProfile('user1')).toEqual({ id: 'user1', karma: 100 });
    });

    it('should return undefined for non-existent profile', () => {
      const updates = { profiles: [{ id: 'user1', karma: 100 }] };
      UpdatesStore.setUpdates(updates);
      expect(UpdatesStore.getProfile('user2')).toBeUndefined();
    });
  });
});
