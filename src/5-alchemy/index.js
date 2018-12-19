const R = require('ramda');

/**
 * @param {string} a
 * @param {string} b
 */
const areReactive = (a, b) => a[0] === b[0] && a[1] !== b[1];

/**
 * @param {string[]} list
 * @param {number} index
 */
const getNextPopulatedIndex = (list, index) => {
  let i = index;
  while (true) {
    i += 1;
    if (list[i] || i > list.length) return i;
  }
};

/**
 * @param polymer {string[]}
 * @returns string[]
 */
const react = polymer => {
  const result = R.clone(polymer);
  let reacting = true;
  while (reacting) {
    reacting = false;
    result.forEach((elem, index) => {
      const nextPopulatedIndex = getNextPopulatedIndex(result, index);
      if (
        result[nextPopulatedIndex] &&
        areReactive(elem, result[nextPopulatedIndex])
      ) {
        reacting = true;
        delete result[index];
        delete result[nextPopulatedIndex];
      }
    });
  }
  return result;
};

/**
 * @param unit {string}
 * @returns {[string, boolean]}
 */
const toToken = unit => {
  const id = R.toLower(unit);
  return [id, id === unit];
};

const calculateReactedLength = R.pipe(
  react,
  R.reject(R.isNil),
  R.length
);

/**
 * @param input {string}
 * @returns {number}
 */
exports.standard = R.pipe(
  R.head,
  R.splitEvery(1),
  R.map(toToken),
  calculateReactedLength
);

/**
 * @param input {string}
 * @returns {number}
 */
exports.plus = R.pipe(
  R.head,
  R.splitEvery(1),
  R.map(toToken),
  polymer => {
    const unitTypes = R.pipe(
      R.map(R.nth(0)),
      R.uniq
    )(polymer);

    return R.map(unitToRemove =>
      R.pipe(
        R.reject(x => x[0] === unitToRemove),
        calculateReactedLength
      )(polymer)
    )(unitTypes);
  },
  R.sortBy(R.identity),
  R.head
);
