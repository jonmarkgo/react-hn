function extend(dest, ...sources) {
  const visited = new WeakMap();

  function extendInternal(dest, source) {
    if (source === null || typeof source !== 'object') {
      return source;
    }

    if (visited.has(source)) {
      return visited.get(source);
    }

    let result = Array.isArray(source) ? [...source] : { ...dest };
    visited.set(source, result);

    Object.keys(source).forEach(key => {
      const sourceValue = source[key];
      if (sourceValue === source) {
        result[key] = result; // Handle self-referential structures
      } else if (visited.has(sourceValue)) {
        result[key] = visited.get(sourceValue);
      } else if (typeof sourceValue === 'object' && sourceValue !== null) {
        if (typeof dest[key] === 'object' && dest[key] !== null && !Array.isArray(sourceValue)) {
          result[key] = extendInternal(dest[key], sourceValue);
        } else {
          result[key] = extendInternal({}, sourceValue);
        }
      } else {
        result[key] = sourceValue;
      }
    });

    return result;
  }

  return sources.reduce((acc, source) => {
    if (source == null) return acc;
    const result = extendInternal(acc, source);
    Object.assign(acc, result);
    return acc;
  }, dest);
}

export default extend
