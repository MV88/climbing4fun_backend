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
      'grades.csv',
    ),
    'utf8',
  );

const grades = Papa.parse(csvData, {
  header: true,
});

module.exports = grades.data;
