import setTitle from '../utils/setTitle';
import constants from '../utils/constants';

const SITE_TITLE = constants.SITE_TITLE;

describe('setTitle', () => {
  const originalTitle = document.title;

  afterEach(() => {
    document.title = originalTitle;
  });

  it('should set the document title to the given title', () => {
    setTitle('Test Title');
    expect(document.title).toBe(`Test Title | ${SITE_TITLE}`);
  });

  it('should set the document title to just SITE_TITLE when no title is provided', () => {
    setTitle();
    expect(document.title).toBe(SITE_TITLE);
  });

  it('should set the document title to just SITE_TITLE when an empty string is provided', () => {
    setTitle('');
    expect(document.title).toBe(SITE_TITLE);
  });

  it('should handle special characters in the title', () => {
    setTitle('Test & Title');
    expect(document.title).toBe(`Test & Title | ${SITE_TITLE}`);
  });

  it('should handle numbers in the title', () => {
    setTitle('Test 123');
    expect(document.title).toBe(`Test 123 | ${SITE_TITLE}`);
  });

  it('should handle very long titles', () => {
    const longTitle = 'A'.repeat(100);
    setTitle(longTitle);
    expect(document.title).toBe(`${longTitle} | ${SITE_TITLE}`);
  });

  it('should handle titles with leading/trailing whitespace', () => {
    setTitle('  Test Title  ');
    expect(document.title).toBe(`Test Title | ${SITE_TITLE}`);
  });

  it('should handle non-string input', () => {
    setTitle(123);
    expect(document.title).toBe(`123 | ${SITE_TITLE}`);
  });

  it('should handle null input', () => {
    setTitle(null);
    expect(document.title).toBe(SITE_TITLE);
  });

  it('should handle undefined input', () => {
    setTitle(undefined);
    expect(document.title).toBe(SITE_TITLE);
  });
});
