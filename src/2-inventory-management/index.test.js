const { getInput } = require('../util');
const { standard, plus } = require('.');

describe('standard', () => {
  test('calculates cheksum', () => {
    expect(
      standard([
        'abcdef',
        'bababc',
        'abbcde',
        'abcccd',
        'aabcdd',
        'abcdee',
        'ababab'
      ])
    ).toBe(12);
  });

  test('solves puzzle', async () => {
    expect(standard(await getInput(__dirname))).toMatchInlineSnapshot(`7470`);
  });
});

describe('plus', () => {
  test('finds matching letters', () => {
    expect(
      plus(['abcde', 'fghij', 'klmno', 'pqrst', 'fguij', 'axcye', 'wvxyz'])
    ).toBe('fgij');
  });

  test('solves puzzle', async () => {
    expect(plus(await getInput(__dirname))).toMatchInlineSnapshot(
      `"kqzxdenujwcstybmgvyiofrrd"`
    );
  });
});
