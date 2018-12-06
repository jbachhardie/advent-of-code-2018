const { getInput } = require('./util')
const { standard, plus } = require('./4-repose')

describe('standard', () => {
  test.only('counts intersecting points', () => {
    const input = `
[1518-11-01 00:00] Guard #10 begins shift
[1518-11-01 00:05] falls asleep
[1518-11-01 00:25] wakes up
[1518-11-01 00:30] falls asleep
[1518-11-01 00:55] wakes up
[1518-11-01 23:58] Guard #99 begins shift
[1518-11-02 00:40] falls asleep
[1518-11-02 00:50] wakes up
[1518-11-03 00:05] Guard #10 begins shift
[1518-11-03 00:24] falls asleep
[1518-11-03 00:29] wakes up
[1518-11-04 00:02] Guard #99 begins shift
[1518-11-04 00:36] falls asleep
[1518-11-04 00:46] wakes up
[1518-11-05 00:03] Guard #99 begins shift
[1518-11-05 00:45] falls asleep
[1518-11-05 00:55] wakes up
    `
      .trim()
      .split('\n')
    expect(standard(input)).toBe(240)
  })

  test('solves puzzle', async () => {
    expect(
      standard(await getInput('4-repose.input.txt'))
    ).toMatchInlineSnapshot(`105047`)
  })
})

describe('plus', () => {
  test('finds non-overlapping', () => {
    expect(plus(['#1 @ 1,3: 4x4', '#2 @ 3,1: 4x4', '#3 @ 5,5: 2x2'])).toBe(3)
  })

  test('solves puzzle', async () => {
    expect(plus(await getInput('4-repose.input.txt'))).toMatchInlineSnapshot(
      `658`
    )
  })
})
