import buildClassName from '../utils/buildClassName';

describe('buildClassName', () => {
  it('should return an empty string for no arguments', () => {
    expect(buildClassName()).toBe('');
  });

  it('should return the class name for a single string argument', () => {
    expect(buildClassName('test')).toBe('test');
  });

  it('should concatenate multiple string arguments', () => {
    expect(buildClassName('test1', 'test2', 'test3')).toBe('test1 test2 test3');
  });

  it('should ignore falsy values', () => {
    expect(buildClassName('test1', null, 'test2', undefined, 'test3', false, '')).toBe('test1 test2 test3');
  });

  it('should handle array arguments', () => {
    expect(buildClassName(['test1', 'test2'], 'test3')).toBe('test1 test2 test3');
  });

  it('should handle nested array arguments', () => {
    expect(buildClassName(['test1', ['test2', 'test3']], 'test4')).toBe('test1 test2 test3 test4');
  });

  it('should handle object arguments', () => {
    expect(buildClassName({ 'test1': true, 'test2': false, 'test3': true })).toBe('test1 test3');
  });

  it('should handle mixed argument types', () => {
    expect(buildClassName('test1', ['test2', 'test3'], { 'test4': true, 'test5': false }, 'test6')).toBe('test1 test2 test3 test4 test6');
  });

  it('should deduplicate class names', () => {
    expect(buildClassName('test', 'test', 'test')).toBe('test');
  });

  it('should handle empty strings', () => {
    expect(buildClassName('', 'test', '')).toBe('test');
  });

  it('should handle whitespace-only strings', () => {
    expect(buildClassName('  ', 'test', '   ')).toBe('test');
  });

  it('should trim whitespace from class names', () => {
    expect(buildClassName(' test1 ', ' test2 ')).toBe('test1 test2');
  });
});
