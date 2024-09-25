import pluralise from './pluralise';

describe('pluralise', () => {
  test('returns singular suffix when count is 1', () => {
    expect(pluralise(1)).toBe('');
    expect(pluralise(1, 'item,items')).toBe('item');
  });

  test('returns plural suffix when count is not 1', () => {
    expect(pluralise(0)).toBe('s');
    expect(pluralise(2)).toBe('s');
    expect(pluralise(0, 'item,items')).toBe('items');
    expect(pluralise(2, 'item,items')).toBe('items');
  });

  test('handles custom suffixes', () => {
    expect(pluralise(1, 'mouse,mice')).toBe('mouse');
    expect(pluralise(2, 'mouse,mice')).toBe('mice');
  });

  test('defaults to ",s" when no suffix is provided', () => {
    expect(pluralise(1)).toBe('');
    expect(pluralise(2)).toBe('s');
  });
});
