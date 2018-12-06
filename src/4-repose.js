const R = require('ramda')
const D = require('date-fns/fp')

/** @enum {number} */
const Event = {
  Begin: 0,
  Wake: 1,
  Sleep: 2
}

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
])

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
)

/**
 * @param {string[]} input
 * @returns {number}
 */
exports.standard = R.pipe(
  R.map(parse),
  R.sortBy(x => x[0])
)

exports.plus = () => {}
