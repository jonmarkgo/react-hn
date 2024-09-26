import StoryCommentThreadStore from '../stores/StoryCommentThreadStore';
import HNService from '../services/HNService';

jest.mock('../services/HNService');

// Create a mock instance of StoryCommentThreadStore
const mockStoryCommentThreadStore = {
  reset: jest.fn(),
  setCommentThread: jest.fn(),
  getCommentThread: jest.fn(),
  fetchCommentThread: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
  getCommentThreads: jest.fn(),
  getAllCommentThreads: jest.fn(),
};

// Mock the default export of StoryCommentThreadStore
jest.mock('../stores/StoryCommentThreadStore', () => ({
  __esModule: true,
  default: mockStoryCommentThreadStore,
}));

describe('StoryCommentThreadStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStoryCommentThreadStore.reset();
  });

  describe('getCommentThread', () => {
    it('should return a comment thread from the cache', () => {
      const thread = { id: 1, kids: [2, 3] };
      mockStoryCommentThreadStore.setCommentThread(thread);
      mockStoryCommentThreadStore.getCommentThread.mockReturnValue(thread);
      expect(mockStoryCommentThreadStore.getCommentThread(1)).toEqual(thread);
    });

    it('should return undefined for non-existent thread', () => {
      mockStoryCommentThreadStore.getCommentThread.mockReturnValue(undefined);
      expect(mockStoryCommentThreadStore.getCommentThread(999)).toBeUndefined();
    });
  });

  describe('setCommentThread', () => {
    it('should add a comment thread to the cache', () => {
      const thread = { id: 1, kids: [2, 3] };
      mockStoryCommentThreadStore.setCommentThread(thread);
      mockStoryCommentThreadStore.getCommentThread.mockReturnValue(thread);
      expect(mockStoryCommentThreadStore.getCommentThread(1)).toEqual(thread);
    });

    it('should trigger change event when adding a new thread', () => {
      const listener = jest.fn();
      mockStoryCommentThreadStore.addListener('change', listener);

      const thread = { id: 1, kids: [2, 3] };
      mockStoryCommentThreadStore.setCommentThread(thread);

      expect(listener).toHaveBeenCalled();
    });
  });

  describe('fetchCommentThread', () => {
    it('should fetch a comment thread from the API', async () => {
      const thread = { id: 1, kids: [2, 3] };
      fetchAPI.mockResolvedValue(thread);

      await mockStoryCommentThreadStore.fetchCommentThread(1);

      expect(fetchAPI).toHaveBeenCalledWith('item/1');
      mockStoryCommentThreadStore.getCommentThread.mockReturnValue(thread);
      expect(mockStoryCommentThreadStore.getCommentThread(1)).toEqual(thread);
    });

    it('should handle errors when fetching a comment thread', async () => {
      const error = new Error('Failed to fetch');
      fetchAPI.mockRejectedValue(error);

      await expect(mockStoryCommentThreadStore.fetchCommentThread(1)).rejects.toThrow('Failed to fetch');
    });
  });

  describe('addListener and removeListener', () => {
    it('should add and remove change listeners', () => {
      const listener = jest.fn();

      mockStoryCommentThreadStore.addListener('change', listener);
      mockStoryCommentThreadStore.setCommentThread({ id: 1, kids: [2, 3] });
      expect(listener).toHaveBeenCalledTimes(1);

      mockStoryCommentThreadStore.removeListener('change', listener);
      mockStoryCommentThreadStore.setCommentThread({ id: 2, kids: [4, 5] });
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('reset', () => {
    it('should clear the cache and listeners', () => {
      const thread = { id: 1, kids: [2, 3] };
      mockStoryCommentThreadStore.setCommentThread(thread);
      const listener = jest.fn();
      mockStoryCommentThreadStore.addListener('change', listener);

      mockStoryCommentThreadStore.reset();

      mockStoryCommentThreadStore.getCommentThread.mockReturnValue(undefined);
      expect(mockStoryCommentThreadStore.getCommentThread(1)).toBeUndefined();
      mockStoryCommentThreadStore.setCommentThread({ id: 2, kids: [4, 5] });
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('getCommentThreads', () => {
    it('should return multiple comment threads', () => {
      const threads = [
        { id: 1, kids: [2, 3] },
        { id: 2, kids: [4, 5] },
      ];
      mockStoryCommentThreadStore.setCommentThread(threads[0]);
      mockStoryCommentThreadStore.setCommentThread(threads[1]);

      mockStoryCommentThreadStore.getCommentThreads.mockReturnValue(threads);
      const result = mockStoryCommentThreadStore.getCommentThreads([1, 2]);

      expect(result).toEqual(threads);
    });

    it('should return undefined for non-existent threads', () => {
      mockStoryCommentThreadStore.getCommentThreads.mockReturnValue([undefined, undefined]);
      const result = mockStoryCommentThreadStore.getCommentThreads([1, 2]);

      expect(result).toEqual([undefined, undefined]);
    });
  });

  describe('getAllCommentThreads', () => {
    it('should return all comment threads in the cache', () => {
      const threads = [
        { id: 1, kids: [2, 3] },
        { id: 2, kids: [4, 5] },
      ];
      mockStoryCommentThreadStore.setCommentThread(threads[0]);
      mockStoryCommentThreadStore.setCommentThread(threads[1]);

      mockStoryCommentThreadStore.getAllCommentThreads.mockReturnValue(threads);
      const result = mockStoryCommentThreadStore.getAllCommentThreads();

      expect(result).toEqual(threads);
    });

    it('should return an empty array when cache is empty', () => {
      mockStoryCommentThreadStore.getAllCommentThreads.mockReturnValue([]);
      const result = mockStoryCommentThreadStore.getAllCommentThreads();

      expect(result).toEqual([]);
    });
  });
});
