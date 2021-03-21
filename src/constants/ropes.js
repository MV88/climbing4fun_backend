const fs = require('fs');
const path = require('path');
const Papa = require('papaparse');

const csvData = fs
  .readFileSync(
    path.join(
      __dirname,
      '..',
      '..',
      'src',
      'db',
      'sources',
      'ropes.csv',
    ),
    'utf8',
  );

const ropes = Papa.parse(csvData, {
  header: true,
});

module.exports = ropes.data;
