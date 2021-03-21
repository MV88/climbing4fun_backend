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
      'styles.csv',
    ),
    'utf8',
  );

const styles = Papa.parse(csvData, {
  header: true,
});

module.exports = styles
  .data
  .map(({ name, description }) => ({
    name,
    description,
  }));
