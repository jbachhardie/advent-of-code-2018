const { getInput } = require('../util');
const { standard, plus } = require('.');

describe('standard', () => {
  test('passes test', () => {
    const input = [];
    const expected = NaN;
    expect(standard(input)).toBe(expected);
  });

  test.skip('solves puzzle', async () => {
    expect(standard(await getInput(__dirname))).toMatchInlineSnapshot();
  });
});

describe('plus', () => {
  test('passes test', () => {
    const input = [];
    const expected = NaN;
    expect(plus(input)).toBe(expected);
  });

  test('solves puzzle', async () => {
    expect(plus(await getInput(__dirname))).toMatchInlineSnapshot();
  });
});
