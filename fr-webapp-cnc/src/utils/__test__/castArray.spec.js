import expect from 'expect';
import castArray from '../castArray';

describe('castArray utility', () => {
  it('should return the same array', () => {
    const arr = [1, 2, 3, '4', 'pet'];

    expect(castArray(arr)).toBe(arr);
    expect(castArray(arr)).toInclude('4');
    expect(castArray(arr)).toInclude('pet');
    expect(castArray(arr)).toInclude(2);
  });

  it('should return array from [NaN]', () => {
    expect(castArray([NaN])).toInclude(NaN);
    expect(castArray([NaN]).length).toBe(1);
  });

  it('should return array from NaN', () => {
    expect(castArray(NaN)).toInclude(NaN);
    expect(castArray(NaN).length).toBe(1);
  });

  it('should return array from false', () => {
    expect(castArray(false)).toInclude(false);
    expect(castArray(false).length).toBe(1);
  });

  it('should return array from null', () => {
    expect(castArray(null)).toInclude(null);
    expect(castArray(null).length).toBe(1);
  });

  it('should return array from undefined', () => {
    expect(castArray(undefined).length).toBe(0);
    expect(castArray().length).toBe(0);
    expect(Object.prototype.toString.call(castArray())).toBe('[object Array]');
  });

  it('should return array from {}', () => {
    expect(castArray({}).length).toBe(1);
    expect(Object.prototype.toString.call(castArray({}))).toBe('[object Array]');
  });

  it('should return array from []', () => {
    expect(castArray([]).length).toBe(0);
    expect(Object.prototype.toString.call(castArray([]))).toBe('[object Array]');
  });

  it('should return empty array from filtered [undefined, 0, null]', () => {
    const nada = [undefined, 0, null];

    expect(castArray(nada, nada).length).toBe(0);
    expect(castArray(nada, nada)).toExclude(undefined);
    expect(castArray(nada, nada)).toExclude(0);
    expect(castArray(nada, nada)).toExclude(null);
    expect(Object.prototype.toString.call(castArray(nada, nada))).toBe('[object Array]');
  });

  it('should return array [0, 1, 2, null, 4, undefined] without `undefined, 0, null`', () => {
    const nada = [undefined, 0, null];
    const arr = [0, 1, 2, null, 4, undefined];

    expect(castArray(arr, nada)).toInclude(1);
    expect(castArray(arr, nada)).toInclude(2);
    expect(castArray(arr, nada)).toExclude(undefined);
    expect(castArray(arr, nada)).toExclude(null);
    expect(castArray(arr, nada)).toExclude(0);
    expect(Object.prototype.toString.call(castArray(arr, nada))).toBe('[object Array]');
  });

  it('should filter out undefined, 0 and null', () => {
    const nada = [undefined, 0, null];

    expect(castArray(0, nada)).toExclude(1);
    expect(castArray(null, nada)).toExclude(null);
    expect(castArray(undefined, nada)).toExclude(undefined);
    expect(castArray('', nada)).toInclude('');
  });
});
