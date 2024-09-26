import extend from '../utils/extend';

describe('extend', () => {
  it('should merge properties from source objects to target object', () => {
    const target = { a: 1, b: 2 };
    const source1 = { b: 3, c: 4 };
    const source2 = { d: 5 };

    const result = extend(target, source1, source2);

    expect(result).toEqual({ a: 1, b: 3, c: 4, d: 5 });
    expect(result).toEqual(target); // Should modify the target object
  });

  it('should handle empty source objects', () => {
    const target = { a: 1, b: 2 };
    const result = extend(target, {}, {});

    expect(result).toEqual({ a: 1, b: 2 });
    expect(result).toEqual(target);
  });

  it('should handle null or undefined source objects', () => {
    const target = { a: 1, b: 2 };
    const result = extend(target, null, undefined, { c: 3 });

    expect(result).toEqual({ a: 1, b: 2, c: 3 });
    expect(result).toEqual(target);
  });

  it('should overwrite properties with falsy values', () => {
    const target = { a: 1, b: 2, c: 3 };
    const source = { b: 0, c: null, d: false };

    const result = extend(target, source);

    expect(result).toEqual({ a: 1, b: 0, c: null, d: false });
    expect(result).toEqual(target);
  });

  it('should handle nested objects', () => {
    const target = { a: { x: 1, y: 2 }, b: 3 };
    const source = { a: { y: 4, z: 5 }, c: 6 };

    const result = extend(target, source);

    expect(result).toEqual({ a: { x: 1, y: 4, z: 5 }, b: 3, c: 6 });
    expect(result).toEqual(target);
    expect(result.a).toEqual(target.a); // Should modify nested objects
  });

  it('should handle arrays', () => {
    const target = { a: [1, 2], b: 3 };
    const source = { a: [3, 4], c: 5 };

    const result = extend(target, source);

    expect(result).toEqual({ a: [3, 4], b: 3, c: 5 });
    expect(result).toEqual(target);
    expect(result.a).toEqual(source.a); // Should replace arrays, not merge them
  });

  it('should handle functions', () => {
    const target = { a: () => 1 };
    const source = { a: () => 2, b: () => 3 };

    const result = extend(target, source);

    expect(result.a()).toBe(2);
    expect(result.b()).toBe(3);
    expect(result).toEqual(target);
  });

  it('should handle multiple source objects', () => {
    const target = { a: 1 };
    const source1 = { b: 2 };
    const source2 = { c: 3 };
    const source3 = { d: 4 };

    const result = extend(target, source1, source2, source3);

    expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
    expect(result).toEqual(target);
  });

  it('should handle circular references', () => {
    const target = { a: 1 };
    const source = { b: 2 };
    source.self = source;

    const result = extend(target, source);

    expect(result).toEqual({ a: 1, b: 2, self: result.self });
    expect(result.self).toBe(result.self);
    expect(result.self.b).toBe(2);
    expect(result.self.self).toBe(result.self);
  });

  it('should return the target object if no source objects are provided', () => {
    const target = { a: 1, b: 2 };
    const result = extend(target);

    expect(result).toEqual({ a: 1, b: 2 });
    expect(result).toBe(target);
  });
});
