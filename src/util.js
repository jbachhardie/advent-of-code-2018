const fs = require('fs').promises
const { EOL } = require('os')

exports.getInput = async filename => {
  const input = await fs.readFile(__dirname + '/' + filename, {
    encoding: 'utf8'
  })
  return input.split(EOL)
}
