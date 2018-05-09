import expect from 'expect';
import { intersect, areIntersecting } from '../intersect';

describe('intersect utility', () => {
  const array1 = [1, 2, 3, '4', 'pet'];
  const array2 = [0, 5];
  const array3 = [0, 3];
  const array4 = [6, 4];
  const array5 = ['pet'];
  const array6 = [NaN];
  const array7 = NaN;
  const array8 = false;

  it('should find intersections 3', () => {
    expect(intersect(array1, array3)).toInclude(3);
    expect(intersect(array1, array3)).toExclude(0);
  });

  it('should find intersections "pet"', () => {
    expect(intersect(array1, array5)).toInclude('pet');
    expect(intersect(array1, array5)).toExclude('4');
    expect(intersect(array1, array5)).toExclude(1);
  });

  it('should not find intersections', () => {
    expect(intersect(array1, array2).length).toBe(0);
    expect(intersect(array1, array4).length).toBe(0);
    expect(intersect(array1, array6).length).toBe(0);
    expect(intersect(array1, array7).length).toBe(0);
    expect(intersect(array1, array8).length).toBe(0);
  });

  it('should find matches', () => {
    expect(areIntersecting(array1, array3)).toBe(true);
    expect(areIntersecting(array1, array5)).toBe(true);
  });

  it('should not find matches', () => {
    expect(areIntersecting(array1, array2)).toBe(false);
    expect(areIntersecting(array1, array4)).toBe(false);
    expect(areIntersecting(array1, array6)).toBe(false);
    expect(areIntersecting(array1, array7)).toBe(false);
    expect(areIntersecting(array1, array8)).toBe(false);
  });
});
