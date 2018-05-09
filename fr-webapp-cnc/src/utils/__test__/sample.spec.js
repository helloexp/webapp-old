import { expect } from 'chai';

const testObj = {
  event: { test: 'one' },
  status: ['error', 'ok', { test: 'fail' }],
};

// Using describe/it/expect format
describe('sample test - ', () => {
  it('describe should exist in scope', () => {
    expect(describe).to.not.equal(undefined);
  });

  it('describe should be a function', () => {
    expect(describe).to.be.a('function');
  });

  it('test object should be defined', () => {
    expect(testObj).to.not.equal(undefined);
    expect(testObj.xyz).to.equal(undefined);
  });

  it('test object should have properties', () => {
    expect(testObj).to.have.deep.property('event.test', 'one');
    expect(testObj).to.have.deep.property('status');
  });

  it('test object should have string property', () => {
    expect(testObj).to.have.deep.property('event.test').that.is.a('string');
  });

  it('null should be "null"', () => {
    expect(null).to.be.a('null');
  });

  it('undefined should be "undefined"', () => {
    expect(undefined).to.be.an('undefined');
  });
});
