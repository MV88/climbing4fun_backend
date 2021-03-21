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
      'media.csv',
    ),
    'utf8',
  );

const media = Papa.parse(csvData, {
  header: true,
});

module.exports = media.data;
