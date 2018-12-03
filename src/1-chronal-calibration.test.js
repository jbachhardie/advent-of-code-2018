const fs = require("fs").promises;
const { EOL } = require("os");
const { standard, plus } = require("./1-chronal-calibration");

describe("standard", () => {
  test.each`
    changes         | expected
    ${[0, 1]}       | ${1}
    ${[1, -2]}      | ${-1}
    ${[-1, 3]}      | ${2}
    ${[2, 1]}       | ${3}
    ${[1, 1, 1]}    | ${3}
    ${[1, 1, -2]}   | ${0}
    ${[-1, -2, -3]} | ${-6}
  `("returns $expected when $changes are applied", ({ changes, expected }) => {
    expect(standard(changes)).toBe(expected);
  });

  test("solve puzzle", async () => {
    const input = await fs.readFile(
      __dirname + "/1-chronal-calibration.input.txt",
      { encoding: "utf8" }
    );
    expect(standard(input.split(EOL).map(parseInt))).toMatchInlineSnapshot(
      `408`
    );
  });
});

describe("plus", () => {
  test.each`
    changes               | expected
    ${[1, -2, 3, 1]}      | ${2}
    ${[1, -1]}            | ${0}
    ${[3, 3, 4, -2, -4]}  | ${10}
    ${[-6, 3, 8, 5, -6]}  | ${5}
    ${[7, 7, -2, -7, -4]} | ${14}
  `("sees $expected twice first for $changes", ({ changes, expected }) => {
    expect(plus(changes)).toBe(expected);
  });

  test("solve puzzle", async () => {
    const input = await fs.readFile(
      __dirname + "/1-chronal-calibration.input.txt",
      { encoding: "utf8" }
    );
    expect(plus(input.split(EOL).map(parseInt))).toMatchInlineSnapshot(`55250`);
  });
});
