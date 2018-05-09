import expect from 'expect';
import isObject from '../isObject';

describe('isObject', () => {
  it('should return true for {}', () => {
    expect(
      isObject({})
    ).toBe(true);
  });

  it('should return false for []', () => {
    expect(
      isObject([])
    ).toBe(false);
  });

  it('should return false for function', () => {
    expect(
      isObject(() => true)
    ).toBe(false);
  });

  it('should return false for number', () => {
    expect(
      isObject(3)
    ).toBe(false);
  });

  it('should return false for string', () => {
    expect(
      isObject('foo')
    ).toBe(false);
  });

  it('should return false for null', () => {
    expect(
      isObject(null)
    ).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(
      isObject(undefined)
    ).toBe(false);
  });

  it('should return false for NaN', () => {
    expect(
      isObject(NaN)
    ).toBe(false);
  });
});
