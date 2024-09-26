import cancellableDebounce from '../utils/cancellableDebounce';

jest.useFakeTimers();

describe('cancellableDebounce', () => {
  let mockFn;
  let debouncedFn;

  beforeEach(() => {
    mockFn = jest.fn();
    debouncedFn = cancellableDebounce(mockFn, 1000);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should delay function execution', () => {
    debouncedFn();
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(999);
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should cancel previous call if invoked before delay', () => {
    debouncedFn();
    debouncedFn();

    jest.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments to the debounced function', () => {
    debouncedFn('test', 123);

    jest.advanceTimersByTime(1000);
    expect(mockFn).toHaveBeenCalledWith('test', 123);
  });

  it('should return a cancel function', () => {
    const cancel = debouncedFn();
    expect(typeof cancel).toBe('function');
  });

  it('should cancel delayed function execution when cancel is called', () => {
    const cancel = debouncedFn();
    cancel();

    jest.advanceTimersByTime(1000);
    expect(mockFn).not.toHaveBeenCalled();
  });

  it('should work correctly with multiple instances', () => {
    const debouncedFn1 = cancellableDebounce(mockFn, 1000);
    const debouncedFn2 = cancellableDebounce(mockFn, 500);

    debouncedFn1();
    debouncedFn2();

    jest.advanceTimersByTime(500);
    expect(mockFn).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(500);
    expect(mockFn).toHaveBeenCalledTimes(2);
  });

  it('should handle edge case of 0 delay', () => {
    const immediateDebounce = cancellableDebounce(mockFn, 0);
    immediateDebounce();

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should handle edge case of negative delay', () => {
    const negativeDebounce = cancellableDebounce(mockFn, -1000);
    negativeDebounce();

    expect(mockFn).toHaveBeenCalledTimes(1);
  });
});
