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
      'galleries.csv',
    ),
    'utf8',
  );

const galleries = Papa.parse(csvData, {
  header: true,
});

module.exports = galleries.data;
