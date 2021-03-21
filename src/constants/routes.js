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
      'routes.csv',
    ),
    'utf8',
  );

const routes = Papa.parse(csvData, {
  header: true,
});

module.exports = routes.data;
