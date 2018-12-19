const R = require('ramda')

/** @type {<T>(number: number) => (array: T[]) => (element: T) => boolean} */
const isRepeated = number => array => element =>
  R.pipe(
    /** @type {<T>(arr: T[]) => T[]} */ (R.filter(R.equals(element))),
    R.length,
    R.equals(number)
  )(array)

/**
 * @param number {number}
 * @returns {(string: string) => boolean}
 */
const hasRepeats = number => R.converge(R.any, [isRepeated(number), R.identity])

/**
 * @param cond {boolean}
 * @param val {number}
 * @returns {number}
 */
const incrementIf = (cond, val) => (cond ? val + 1 : val)

exports.standard = R.pipe(
  R.reduce(
    ([sum2, sum3], id) => [
      incrementIf(hasRepeats(2)(id), sum2),
      incrementIf(hasRepeats(3)(id), sum3)
    ],
    [0, 0]
  ),
  ([sum2, sum3]) => sum2 * sum3
)

const dropDissimilar = (left, right) =>
  R.pipe(
    R.zipWith((x, y) => (x === y ? x : null), left),
    R.filter(x => x !== null)
  )(right)

/** @type {(ids: string[]) => string | null} */
exports.plus = ids =>
  ids.reduce((acc, val, idx, list) => {
    if (acc) return acc
    for (const element of list.slice(idx + 1)) {
      const similar = dropDissimilar(val, element)
      if (similar.length === element.length - 1) return similar.join('')
    }
    return acc
  }, null)
