import { expect } from 'chai';
import getProperty from 'utils/getProperty';

describe('getProperty: ', () => {
  it('should extract property', (done) => {
    const user = {
      name: {
        first: 'Jon',
        last: 'Snow',
      },
    };

    expect(`${getProperty(user, 'name.first')} ${getProperty(user, 'name.last')}`).to.equal('Jon Snow');
    done();
  });

  it('should return default value if path broken', (done) => {
    const user = {
      name: {
        last: 'Snow',
      },
      items: {
        list: [1, 2, 3],
      },
    };

    expect(`${getProperty(user, 'name.first', 'Jon')} ${getProperty(user, 'name.last')}`).to.equal('Jon Snow');

    expect(
      JSON.toString(getProperty(user, 'items.list'))
    ).to.equal(JSON.toString([1, 2, 3]));

    expect(
      JSON.toString(getProperty(user, 'wrong.path.to.array.that.should.be.iterated', ['abra', 'cadabra']))
    ).to.equal(JSON.toString(['abra', 'cadabra']));

    done();
  });

  it('should return default value 0 if path broken', (done) => {
    expect(
      getProperty({ a: { b: 4 } }, 'a.c', 0)
    ).to.equal(0);

    done();
  });

  it('should return 0 as value', (done) => {
    expect(
      getProperty({ a: { b: 0 } }, 'a.b', 1)
    ).to.equal(0);

    done();
  });

  it('shouldn\'t return null or undefined as value', (done) => {
    expect(
      getProperty({ a: { b: null } }, 'a.b', 1)
    ).to.equal(1);

    expect(
      getProperty({ a: { b: undefined } }, 'a.b', 1)
    ).to.equal(1);

    done();
  });
});
