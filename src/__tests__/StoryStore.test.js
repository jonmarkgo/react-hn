import StoryStore from '../stores/StoryStore';
import { fetchAPI } from '../services/HNService';

jest.mock('../services/HNService');

describe('StoryStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    StoryStore.reset();
  });

  describe('getItem', () => {
    it('should return an item from the cache', () => {
      const item = { id: 1, title: 'Test Story' };
      StoryStore.setItem(item);
      expect(StoryStore.getItem(1)).toEqual(item);
    });

    it('should return undefined for non-existent item', () => {
      expect(StoryStore.getItem(999)).toBeUndefined();
    });
  });

  describe('setItem', () => {
    it('should add an item to the cache', () => {
      const item = { id: 1, title: 'Test Story' };
      StoryStore.setItem(item);
      expect(StoryStore.getItem(1)).toEqual(item);
    });
  });

  describe('fetchItem', () => {
    it('should fetch an item from the API', async () => {
      const item = { id: 1, title: 'Test Story' };
      fetchAPI.mockResolvedValue(item);

      await StoryStore.fetchItem(1);

      expect(fetchAPI).toHaveBeenCalledWith('item/1');
      expect(StoryStore.getItem(1)).toEqual(item);
    });

    it('should handle errors when fetching an item', async () => {
      const error = new Error('Failed to fetch');
      fetchAPI.mockRejectedValue(error);

      await expect(StoryStore.fetchItem(1)).rejects.toThrow('Failed to fetch');
    });
  });

  describe('fetchItems', () => {
    it('should fetch multiple items from the API', async () => {
      const items = [
        { id: 1, title: 'Test Story 1' },
        { id: 2, title: 'Test Story 2' },
      ];
      fetchAPI.mockResolvedValueOnce(items[0]).mockResolvedValueOnce(items[1]);

      await StoryStore.fetchItems([1, 2]);

      expect(fetchAPI).toHaveBeenCalledTimes(2);
      expect(fetchAPI).toHaveBeenCalledWith('item/1');
      expect(fetchAPI).toHaveBeenCalledWith('item/2');
      expect(StoryStore.getItem(1)).toEqual(items[0]);
      expect(StoryStore.getItem(2)).toEqual(items[1]);
    });
  });

  describe('storiesPerPage', () => {
    it('should return the number of stories per page', () => {
      expect(StoryStore.storiesPerPage()).toBe(30);
    });
  });

  describe('getTopStoryIds', () => {
    it('should fetch top story IDs from the API', async () => {
      const storyIds = [1, 2, 3];
      fetchAPI.mockResolvedValue(storyIds);

      await StoryStore.getTopStoryIds();

      expect(fetchAPI).toHaveBeenCalledWith('topstories');
      expect(StoryStore.getTopStoryIds()).toEqual(storyIds);
    });
  });

  describe('getStory', () => {
    it('should return a story from the cache', async () => {
      const story = { id: 1, title: 'Test Story' };
      StoryStore.setItem(story);

      const result = await StoryStore.getStory(1);

      expect(result).toEqual(story);
    });

    it('should fetch a story if not in cache', async () => {
      const story = { id: 1, title: 'Test Story' };
      fetchAPI.mockResolvedValue(story);

      const result = await StoryStore.getStory(1);

      expect(fetchAPI).toHaveBeenCalledWith('item/1');
      expect(result).toEqual(story);
    });
  });

  describe('getStories', () => {
    it('should return multiple stories', async () => {
      const stories = [
        { id: 1, title: 'Test Story 1' },
        { id: 2, title: 'Test Story 2' },
      ];
      StoryStore.setItem(stories[0]);
      fetchAPI.mockResolvedValue(stories[1]);

      const result = await StoryStore.getStories([1, 2]);

      expect(fetchAPI).toHaveBeenCalledWith('item/2');
      expect(result).toEqual(stories);
    });
  });

  describe('onChange', () => {
    it('should add a change listener', () => {
      const listener = jest.fn();
      StoryStore.onChange(listener);

      StoryStore.setItem({ id: 1, title: 'Test Story' });

      expect(listener).toHaveBeenCalled();
    });
  });

  describe('offChange', () => {
    it('should remove a change listener', () => {
      const listener = jest.fn();
      StoryStore.onChange(listener);
      StoryStore.offChange(listener);

      StoryStore.setItem({ id: 1, title: 'Test Story' });

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('should clear the cache and listeners', () => {
      const item = { id: 1, title: 'Test Story' };
      StoryStore.setItem(item);
      const listener = jest.fn();
      StoryStore.onChange(listener);

      StoryStore.reset();

      expect(StoryStore.getItem(1)).toBeUndefined();
      StoryStore.setItem({ id: 2, title: 'Another Story' });
      expect(listener).not.toHaveBeenCalled();
    });
  });
});
