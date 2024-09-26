import pageCalc from '../utils/pageCalc';

describe('pageCalc', () => {
  it('should calculate correct page info for first page', () => {
    const result = pageCalc(1, 30, 100);
    expect(result).toEqual({
      pageNum: 1,
      startIndex: 0,
      endIndex: 30,
      hasNext: true,
      hasPrev: false
    });
  });

  it('should calculate correct page info for middle page', () => {
    const result = pageCalc(2, 30, 100);
    expect(result).toEqual({
      pageNum: 2,
      startIndex: 30,
      endIndex: 60,
      hasNext: true,
      hasPrev: true
    });
  });

  it('should calculate correct page info for last page', () => {
    const result = pageCalc(4, 30, 100);
    expect(result).toEqual({
      pageNum: 4,
      startIndex: 90,
      endIndex: 100,
      hasNext: false,
      hasPrev: true
    });
  });

  it('should handle case where items per page exceeds total items', () => {
    const result = pageCalc(1, 50, 30);
    expect(result).toEqual({
      pageNum: 1,
      startIndex: 0,
      endIndex: 30,
      hasNext: false,
      hasPrev: false
    });
  });

  it('should handle case where page number exceeds total pages', () => {
    const result = pageCalc(5, 30, 100);
    expect(result).toEqual({
      pageNum: 5,
      startIndex: 120,
      endIndex: 100,
      hasNext: false,
      hasPrev: true
    });
  });

  it('should handle case with zero total items', () => {
    const result = pageCalc(1, 30, 0);
    expect(result).toEqual({
      pageNum: 1,
      startIndex: 0,
      endIndex: 0,
      hasNext: false,
      hasPrev: false
    });
  });

  it('should handle case with negative page number', () => {
    const result = pageCalc(-1, 30, 100);
    expect(result).toEqual({
      pageNum: -1,
      startIndex: -60,
      endIndex: -30,
      hasNext: true,
      hasPrev: false
    });
  });

  it('should handle case with zero items per page', () => {
    const result = pageCalc(1, 0, 100);
    expect(result).toEqual({
      pageNum: 1,
      startIndex: 0,
      endIndex: 0,
      hasNext: true,
      hasPrev: false
    });
  });

  it('should handle case with negative items per page', () => {
    const result = pageCalc(1, -30, 100);
    expect(result).toEqual({
      pageNum: 1,
      startIndex: 0,
      endIndex: -30,
      hasNext: true,
      hasPrev: false
    });
  });

  it('should handle case with large numbers', () => {
    const result = pageCalc(1000, 1000, 1000000);
    expect(result).toEqual({
      pageNum: 1000,
      startIndex: 999000,
      endIndex: 1000000,
      hasNext: false,
      hasPrev: true
    });
  });
});
