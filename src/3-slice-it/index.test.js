const { getInput } = require('../util');
const { standard, plus } = require('.');

describe('standard', () => {
  test('counts intersecting points', () => {
    expect(standard(['#1 @ 1,3: 4x4', '#2 @ 3,1: 4x4', '#3 @ 5,5: 2x2'])).toBe(
      4
    );
  });

  test.skip('solves puzzle', async () => {
    expect(standard(await getInput(__dirname))).toMatchInlineSnapshot(`105047`);
  });
});

describe('plus', () => {
  test('finds non-overlapping', () => {
    expect(plus(['#1 @ 1,3: 4x4', '#2 @ 3,1: 4x4', '#3 @ 5,5: 2x2'])).toBe(3);
  });

  test('solves puzzle', async () => {
    expect(plus(await getInput(__dirname))).toMatchInlineSnapshot(`658`);
  });
});
