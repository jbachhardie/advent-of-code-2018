const { getInput } = require('../util');
const { standard, plus } = require('.');

describe('standard', () => {
  test('passes test', () => {
    const input = ['dabAcCaCBAcCcaDA'];
    expect(standard(input)).toBe(10);
  });

  test.skip('solves puzzle', async () => {
    expect(standard(await getInput(__dirname))).toMatchInlineSnapshot(`10180`);
  });
});

describe('plus', () => {
  test('passes test', () => {
    const input = ['dabAcCaCBAcCcaDA'];
    expect(plus(input)).toBe(4);
  });

  test('solves puzzle', async () => {
    expect(plus(await getInput(__dirname))).toMatchInlineSnapshot(`5668`);
  });
});
