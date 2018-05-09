import expect from 'expect';
import partialClone from '../partialClone';

describe('partialClone utility function', () => {
  const state = {
    foo: 'foo',
    bar: 'bar',
    baz: 'baz',
    auth: {
      user: {
        accessToken: true,
        gdsSession: true,
      },
    },
  };

  it('should return an object with only foo and bar', () => {
    expect(
      partialClone({}, state, 'foo', 'bar')
    ).toMatch({ foo: 'foo', bar: 'bar' });
  });

  it('should create an object with only foo and bar when no source supplied', () => {
    expect(
      partialClone(state, 'foo', 'bar')
    ).toMatch({ foo: 'foo', bar: 'bar' });
  });

  it('should clone nested', () => {
    const expecting = {
      auth: {
        user: {
          accessToken: true,
          gdsSession: true,
        },
      },
    };

    expect(
      partialClone(state, 'auth')
    ).toMatch(expecting);
  });
});
