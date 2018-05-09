import { expect } from 'chai';
import { formatNumberWithCommas } from 'utils/format';

describe('number: ', () => {
  const SafariNumberMock = class {
    constructor(value) {
      this.value = value;
    }

    toLocaleString() {
      return this.toString();
    }

    toString() {
      return this.value.toString();
    }
  };

  [
    { value: 0, expected: '0' },
    { value: 9, expected: '9' },
    { value: '0', expected: '0' },
    { value: '9', expected: '9' },
    { value: '99', expected: '99' },
    { value: '999', expected: '999' },
    { value: '9999', expected: '9,999' },
    { value: 1234567890, expected: '1,234,567,890' },
    { value: '1234567890', expected: '1,234,567,890' },
    { value: Number('1234567890'), expected: '1,234,567,890' },
    { value: Number(1234567890), expected: '1,234,567,890' },
    { value: String(1234567890), expected: '1,234,567,890' },
    { value: String('1234567890'), expected: '1,234,567,890' },
    { value: undefined, expected: '' },
    { value: null, expected: '' },
    { value: '', expected: '' },
    { value: new SafariNumberMock(0), expected: '0' },
    { value: new SafariNumberMock(9), expected: '9' },
    { value: new SafariNumberMock(99), expected: '99' },
    { value: new SafariNumberMock(999), expected: '999' },
    { value: new SafariNumberMock(9999), expected: '9,999' },
    { value: new SafariNumberMock(1234567890), expected: '1,234,567,890' },
    { value: '$1,234,567,890', expected: '$1,234,567,890' },
    { value: '$ 1,234,567,890', expected: '$ 1,234,567,890' },
    { value: '¥1,234,567,890', expected: '¥1,234,567,890' },
    { value: '¥ 1,234,567,890', expected: '¥ 1,234,567,890' },
    { value: '$1234567890', expected: '$1,234,567,890' },
    { value: '$ 1234567890', expected: '$ 1,234,567,890' },
    { value: '¥1234567890', expected: '¥1,234,567,890' },
    { value: '¥ 1234567890', expected: '¥ 1,234,567,890' },
  ].forEach((test) => {
    it(`should format number: ${test.value} (${typeof test.value})`, (done) => {
      expect(formatNumberWithCommas(test.value)).to.equal(test.expected);
      done();
    });
  });
});
