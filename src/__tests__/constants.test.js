import constants from '../utils/constants';

describe('constants', () => {
  it('should export ITEMS_PER_PAGE', () => {
    expect(constants.ITEMS_PER_PAGE).toBeDefined();
    expect(typeof constants.ITEMS_PER_PAGE).toBe('number');
    expect(constants.ITEMS_PER_PAGE).toBeGreaterThan(0);
  });

  it('should export UPDATES_CACHE_SIZE', () => {
    expect(constants.UPDATES_CACHE_SIZE).toBeDefined();
    expect(typeof constants.UPDATES_CACHE_SIZE).toBe('number');
    expect(constants.UPDATES_CACHE_SIZE).toBeGreaterThan(0);
  });

  it('should export SITE_TITLE', () => {
    expect(constants.SITE_TITLE).toBeDefined();
    expect(typeof constants.SITE_TITLE).toBe('string');
    expect(constants.SITE_TITLE.length).toBeGreaterThan(0);
  });

  it('should export SITE_URL', () => {
    expect(constants.SITE_URL).toBeDefined();
    expect(typeof constants.SITE_URL).toBe('string');
    expect(constants.SITE_URL).toMatch(/^https?:\/\//);
  });

  it('should export SITE_DESCRIPTION', () => {
    expect(constants.SITE_DESCRIPTION).toBeDefined();
    expect(typeof constants.SITE_DESCRIPTION).toBe('string');
    expect(constants.SITE_DESCRIPTION.length).toBeGreaterThan(0);
  });

  it('should export SITE_KEYWORDS', () => {
    expect(constants.SITE_KEYWORDS).toBeDefined();
    expect(Array.isArray(constants.SITE_KEYWORDS)).toBe(true);
    expect(constants.SITE_KEYWORDS.length).toBeGreaterThan(0);
    constants.SITE_KEYWORDS.forEach(keyword => {
      expect(typeof keyword).toBe('string');
      expect(keyword.length).toBeGreaterThan(0);
    });
  });

  it('should export SITE_TWITTER', () => {
    expect(constants.SITE_TWITTER).toBeDefined();
    expect(typeof constants.SITE_TWITTER).toBe('string');
    expect(constants.SITE_TWITTER).toMatch(/^@/);
  });

  it('should export API_BASE', () => {
    expect(constants.API_BASE).toBeDefined();
    expect(typeof constants.API_BASE).toBe('string');
    expect(constants.API_BASE).toMatch(/^https?:\/\//);
  });

  it('should export CACHE_KEY', () => {
    expect(constants.CACHE_KEY).toBeDefined();
    expect(typeof constants.CACHE_KEY).toBe('string');
    expect(constants.CACHE_KEY.length).toBeGreaterThan(0);
  });

  it('should export SETTINGS_KEY', () => {
    expect(constants.SETTINGS_KEY).toBeDefined();
    expect(typeof constants.SETTINGS_KEY).toBe('string');
    expect(constants.SETTINGS_KEY.length).toBeGreaterThan(0);
  });

  it('should export UPDATES_KEY', () => {
    expect(constants.UPDATES_KEY).toBeDefined();
    expect(typeof constants.UPDATES_KEY).toBe('string');
    expect(constants.UPDATES_KEY.length).toBeGreaterThan(0);
  });

  it('should export ITEM_TYPES', () => {
    expect(constants.ITEM_TYPES).toBeDefined();
    expect(typeof constants.ITEM_TYPES).toBe('object');
    expect(Object.keys(constants.ITEM_TYPES).length).toBeGreaterThan(0);
    Object.values(constants.ITEM_TYPES).forEach(type => {
      expect(typeof type).toBe('string');
      expect(type.length).toBeGreaterThan(0);
    });
  });

  it('should export STORY_TYPES', () => {
    expect(constants.STORY_TYPES).toBeDefined();
    expect(typeof constants.STORY_TYPES).toBe('object');
    expect(Object.keys(constants.STORY_TYPES).length).toBeGreaterThan(0);
    Object.values(constants.STORY_TYPES).forEach(type => {
      expect(typeof type).toBe('string');
      expect(type.length).toBeGreaterThan(0);
    });
  });

  it('should export STORIES_PER_PAGE', () => {
    expect(constants.STORIES_PER_PAGE).toBeDefined();
    expect(typeof constants.STORIES_PER_PAGE).toBe('number');
    expect(constants.STORIES_PER_PAGE).toBeGreaterThan(0);
  });

  it('should export COMMENTS_PER_PAGE', () => {
    expect(constants.COMMENTS_PER_PAGE).toBeDefined();
    expect(typeof constants.COMMENTS_PER_PAGE).toBe('number');
    expect(constants.COMMENTS_PER_PAGE).toBeGreaterThan(0);
  });
});
