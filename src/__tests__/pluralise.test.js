import pluralise from '../utils/pluralise';

describe('pluralise', () => {
  it('should return singular form for count of 1', () => {
    expect(pluralise(1, 'item')).toBe('1 item');
  });

  it('should return plural form for count of 0', () => {
    expect(pluralise(0, 'item')).toBe('0 items');
  });

  it('should return plural form for count greater than 1', () => {
    expect(pluralise(2, 'item')).toBe('2 items');
    expect(pluralise(10, 'item')).toBe('10 items');
  });

  it('should handle custom plural form', () => {
    expect(pluralise(1, 'person', 'people')).toBe('1 person');
    expect(pluralise(2, 'person', 'people')).toBe('2 people');
  });

  it('should handle words ending with "y"', () => {
    expect(pluralise(1, 'story')).toBe('1 story');
    expect(pluralise(2, 'story')).toBe('2 stories');
  });

  it('should handle words ending with "s"', () => {
    expect(pluralise(1, 'bus')).toBe('1 bus');
    expect(pluralise(2, 'bus')).toBe('2 buses');
  });

  it('should handle words ending with "ch"', () => {
    expect(pluralise(1, 'watch')).toBe('1 watch');
    expect(pluralise(2, 'watch')).toBe('2 watches');
  });

  it('should handle irregular plurals', () => {
    expect(pluralise(1, 'child', 'children')).toBe('1 child');
    expect(pluralise(2, 'child', 'children')).toBe('2 children');
  });

  it('should handle uncountable nouns', () => {
    expect(pluralise(1, 'sheep')).toBe('1 sheep');
    expect(pluralise(2, 'sheep')).toBe('2 sheep');
  });

  it('should handle negative numbers', () => {
    expect(pluralise(-1, 'item')).toBe('-1 item');
    expect(pluralise(-2, 'item')).toBe('-2 items');
  });

  it('should handle zero as a string', () => {
    expect(pluralise('0', 'item')).toBe('0 items');
  });

  it('should handle non-numeric input', () => {
    expect(pluralise('many', 'item')).toBe('many items');
  });

  it('should handle floating point numbers', () => {
    expect(pluralise(1.5, 'item')).toBe('1.5 items');
  });

  it('should handle large numbers', () => {
    expect(pluralise(1000000, 'view')).toBe('1000000 views');
  });
});
