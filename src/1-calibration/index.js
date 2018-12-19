const R = require("ramda");

const arrayToGenerator = function*(array) {
  let i = 0;
  while (true) {
    yield array[i];
    i >= array.length - 1 ? (i = 0) : (i += 1);
  }
};

const findFirstRepeatedValue = iter => {
  let current = 0;
  let seen = new Set([0]);
  for (const element of iter) {
    current += element;
    if (seen.has(current)) return current;
    seen.add(current);
  }
};

exports.standard = R.reduce(R.add, 0);

exports.plus = R.pipe(
  arrayToGenerator,
  findFirstRepeatedValue
);
