const fs = require('fs').promises;
const { EOL } = require('os');

exports.getInput = async dirname => {
  const input = await fs.readFile(dirname + '/input.txt', {
    encoding: 'utf8'
  });
  return input.split(EOL);
};
