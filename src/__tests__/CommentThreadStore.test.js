import CommentThreadStore from '../stores/CommentThreadStore';
import { fetchAPI } from '../services/HNService';

jest.mock('../services/HNService');

describe('CommentThreadStore', () => {
  let commentThreadStore;

  beforeEach(() => {
    jest.clearAllMocks();
    commentThreadStore = new CommentThreadStore({ id: 'test' }, () => {});
    commentThreadStore.reset();
  });

  describe('loadCommentThread', () => {
    it('should load a comment thread', async () => {
      const mockComment = {
        id: 1,
        kids: [2, 3],
        text: 'Test comment',
        by: 'testuser',
        time: Date.now() / 1000,
      };
      fetchAPI.mockResolvedValue(mockComment);

      const callback = jest.fn();
      await CommentThreadStore.loadCommentThread(1, callback);

      expect(fetchAPI).toHaveBeenCalledWith('item/1');
      expect(callback).toHaveBeenCalledWith(null, mockComment);
    });

    it('should handle errors when loading a comment thread', async () => {
      const error = new Error('Failed to fetch');
      fetchAPI.mockRejectedValue(error);

      const callback = jest.fn();
      await CommentThreadStore.loadCommentThread(1, callback);

      expect(fetchAPI).toHaveBeenCalledWith('item/1');
      expect(callback).toHaveBeenCalledWith(error);
    });
  });

  describe('loadPermalinkedComment', () => {
    it('should load a permalinked comment', async () => {
      const mockComment = {
        id: 1,
        kids: [2, 3],
        text: 'Test comment',
        by: 'testuser',
        time: Date.now() / 1000,
      };
      fetchAPI.mockResolvedValue(mockComment);

      const callback = jest.fn();
      await CommentThreadStore.loadPermalinkedComment(1, callback);

      expect(fetchAPI).toHaveBeenCalledWith('item/1');
      expect(callback).toHaveBeenCalledWith(null, mockComment);
    });

    it('should handle errors when loading a permalinked comment', async () => {
      const error = new Error('Failed to fetch');
      fetchAPI.mockRejectedValue(error);

      const callback = jest.fn();
      await CommentThreadStore.loadPermalinkedComment(1, callback);

      expect(fetchAPI).toHaveBeenCalledWith('item/1');
      expect(callback).toHaveBeenCalledWith(error);
    });
  });

  describe('addComment', () => {
    it('should add a comment to the store', () => {
      const comment = { id: 1, text: 'Test comment' };
      CommentThreadStore.addComment(comment);

      expect(CommentThreadStore.getComment(1)).toEqual(comment);
    });
  });

  describe('getComment', () => {
    it('should retrieve a comment from the store', () => {
      const comment = { id: 1, text: 'Test comment' };
      CommentThreadStore.addComment(comment);

      expect(CommentThreadStore.getComment(1)).toEqual(comment);
    });

    it('should return undefined for non-existent comment', () => {
      expect(CommentThreadStore.getComment(999)).toBeUndefined();
    });
  });

  describe('removeComment', () => {
    it('should remove a comment from the store', () => {
      const comment = { id: 1, text: 'Test comment' };
      CommentThreadStore.addComment(comment);
      CommentThreadStore.removeComment(1);

      expect(CommentThreadStore.getComment(1)).toBeUndefined();
    });
  });

  describe('reset', () => {
    it('should clear all comments from the store', () => {
      CommentThreadStore.addComment({ id: 1, text: 'Test comment 1' });
      CommentThreadStore.addComment({ id: 2, text: 'Test comment 2' });
      CommentThreadStore.reset();

      expect(CommentThreadStore.getComment(1)).toBeUndefined();
      expect(CommentThreadStore.getComment(2)).toBeUndefined();
    });
  });

  describe('emitChange', () => {
    it('should notify listeners of changes', () => {
      const listener = jest.fn();
      CommentThreadStore.addListener('change', listener);

      CommentThreadStore.emitChange();

      expect(listener).toHaveBeenCalled();
    });
  });

  describe('addListener and removeListener', () => {
    it('should add and remove listeners', () => {
      const listener = jest.fn();
      CommentThreadStore.addListener('change', listener);
      CommentThreadStore.emitChange();
      expect(listener).toHaveBeenCalledTimes(1);

      CommentThreadStore.removeListener('change', listener);
      CommentThreadStore.emitChange();
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });
});
