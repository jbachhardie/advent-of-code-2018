const R = require('ramda');
const D = require('date-fns/fp');

const log = x =>
  require('fs').appendFileSync('log.txt', require('util').inspect(x) + '\n');

/** @enum {number} */
const Event = {
  Begin: 0,
  Wake: 1,
  Sleep: 2
};
/** @enum {string} */
const GuardState = {
  Awake: 'awake',
  Asleep: 'asleep'
};

const parseEvent = R.cond([
  [R.equals('falls asleep'), R.always(Event.Sleep)],
  [R.equals('wakes up'), R.always(Event.Wake)],
  [
    R.T,
    R.converge(R.pair, [
      R.always(Event.Begin),
      R.pipe(
        R.match(/Guard #(\d+) begins shift/),
        R.nth(1),
        parseInt
      )
    ])
  ]
]);

/**
 * @param {string} log
 * @returns {[ Date, Event, ?number ]}
 */
const parse = R.pipe(
  R.match(/\[(.*)\] (.*)/),
  R.tail,
  R.adjust(0, D.parse(new Date(), 'yyyy-MM-dd HH:mm')),
  R.adjust(1, parseEvent),
  R.flatten
);

/**
 * @typedef MinuteLog
 * @property {number} minute
 * @property {GuardState} state
 */

/**
 * @typedef {Object.<string, { trend: Array<number>, count: Object.<GuardState, number> }>} GuardStats
 */

/**
 * @typedef {Record<string, {id: number, log: MinuteLog[]}>} State
 */
const getDay = R.pipe(
  D.addHours(1),
  R.converge(
    R.pipe(
      R.pair,
      R.join('-')
    ),
    [D.getMonth, D.getDate]
  )
);

const setLog = (date, state) =>
  R.over(R.lensPath([getDay(date), 'log']), log =>
    log.fill(state, D.getMinutes(date))
  );

/**
 * @param {[ Date, Event, ?number ][]} eventLog
 * @returns {State}
 */
const calculateMinuteLogs = R.reduce((acc, item) => {
  switch (item[1]) {
    case Event.Begin:
      return R.assoc(
        getDay(item[0]),
        { id: item[2], log: R.repeat(GuardState.Awake, 60) },
        acc
      );
    case Event.Sleep:
      return setLog(item[0], GuardState.Asleep)(acc);
    case Event.Wake:
      return setLog(item[0], GuardState.Awake)(acc);
    default:
      return acc;
  }
}, {});

const calculateCounts = R.pipe(
  R.chain(R.prop('log')),
  R.countBy(R.identity),
  R.objOf('count')
);

const calculateTrend = R.pipe(
  R.reduce((acc, { log }) => {
    const newAcc = R.clone(acc);
    R.addIndex(R.forEach)((item, idx) => {
      if (item === GuardState.Asleep) newAcc[idx] = newAcc[idx] + 1;
    }, log);
    return newAcc;
  }, R.repeat(0, 60)),
  R.objOf('trend')
);

/**
 * @param {State} x
 * @returns {GuardStats}
 */
const calculateGuardStats = R.pipe(
  R.values,
  R.groupBy(R.propOr('N/A', 'id')),
  R.map(R.converge(R.mergeDeepLeft, [calculateCounts, calculateTrend]))
);

const getSortedLog = R.pipe(
  R.map(parse),
  R.sortBy(x => x[0])
);

const getMostAsleep = R.pipe(
  R.toPairs,
  R.sortBy(R.pathOr(0, [1, 'count', 'asleep'])),
  R.last
);

const getMinuteMostAsleep = R.pipe(
  R.prop('trend'),
  arr => arr.indexOf(Math.max(...arr))
);

/**
 * @param {string[]} input
 * @returns {number}
 */
exports.standard = R.pipe(
  getSortedLog,
  calculateMinuteLogs,
  calculateGuardStats,
  getMostAsleep,
  R.adjust(1, getMinuteMostAsleep),
  R.map(parseInt),
  R.apply(R.multiply)
);

const getMostConsistentlyAsleep = R.pipe(
  R.toPairs,
  R.sortBy(
    R.pipe(
      R.path([1, 'trend']),
      R.apply(Math.max)
    )
  ),
  R.last
);

exports.plus = R.pipe(
  getSortedLog,
  calculateMinuteLogs,
  calculateGuardStats,
  getMostConsistentlyAsleep,
  R.adjust(1, getMinuteMostAsleep),
  R.map(parseInt),
  R.apply(R.multiply)
);
