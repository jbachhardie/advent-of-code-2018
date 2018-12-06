const R = require('ramda');

/**
 * @typedef Vector2
 * @property x {number}
 * @property y {number}
 */

/**
 * @typedef Claim
 * @property id {number}
 * @property origin {Vector2}
 * @property dimensions {Vector2}
 */

/**
 * @typedef Rectangle
 * @property bl {Vector2}
 * @property br {Vector2}
 * @property tl {Vector2}
 * @property tr {Vector2}
 */

const claimParser = new RegExp(
  /#(?<id>\d+) @ (?<originx>\d+),(?<originy>\d+): (?<dimensionsx>\d+)x(?<dimensionsy>\d+)/
);

/**
 * @param {string} string
 * @returns {Claim}
 */
const parseClaim = string => {
  const result = claimParser.exec(string);
  if (!(result && result.groups)) {
    throw new Error(`Failed to parse ${string}`);
  }

  /** @type {Record<string, number>} */
  const properties = R.map(x => Number.parseInt(x, 10), result.groups);
  if (R.any(Number.isNaN, R.values(properties))) {
    throw new Error(`Some numbers could not be parsed in ${string}`);
  }

  return {
    id: properties.id,
    origin: {
      x: properties.originx,
      y: properties.originy
    },
    dimensions: {
      x: properties.dimensionsx,
      y: properties.dimensionsy
    }
  };
};

/**
 * @template T
 * @param {T[]} list
 * @returns {Array<[T, T]>}
 */
const combinations = list => {
  /** @type {Array<[T, T]>} */
  const result = [];
  for (let i = 0; i < list.length; ++i)
    for (let j = i + 1; j < list.length; ++j) result.push([list[i], list[j]]);

  return result;
};

/**
 * @param {Claim} claim
 * @returns {Vector2[]}
 */
const claimToPoints = ({ origin, dimensions }) => {
  const result = [];
  for (let x = origin.x; x < origin.x + dimensions.x; ++x)
    for (let y = origin.y; y < origin.y + dimensions.y; ++y)
      result.push({ x, y });
  return result;
};

/**
 * @param {Vector2} vec
 * @returns {number}
 */
const cantor = ({ x, y }) => Math.round(0.5 * (x + y) * (x + y + 1) + y);

/**
 * @param {string[]} input,
 * @returns {number}
 */
exports.standard = R.pipe(
  R.map(
    R.pipe(
      parseClaim,
      claimToPoints,
      R.map(cantor)
    )
  ),
  combinations,
  R.chain(R.apply(R.intersection)),
  R.uniq,
  R.length
);

/**
 * @param {Claim} a
 * @param {Claim} b
 * @returns {boolean}
 */
const above = (a, b) => a.origin.y > b.origin.y + b.dimensions.y - 1;

/**
 * @param {Claim} a
 * @param {Claim} b
 * @returns {boolean}
 */
const rightOf = (a, b) => a.origin.x > b.origin.x + b.dimensions.x - 1;

/**
 * @param {Claim} a
 * @param {Claim} b
 * @returns {boolean}
 */
const overlapping = (a, b) =>
  !above(a, b) && !above(b, a) && !rightOf(a, b) && !rightOf(b, a);

exports.plus = R.pipe(
  R.map(parseClaim),
  R.addIndex(R.reject)((item, idx, list = []) =>
    R.any(R.partial(overlapping, [item]), R.remove(idx, 1, list))
  ),
  R.tap(R.map(R.pipe(console.log))),
  R.head,
  R.prop('id')
);
