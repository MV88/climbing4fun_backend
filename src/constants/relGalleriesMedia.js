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
      'relGalleriesMedia.csv',
    ),
    'utf8',
  );

const relGalleriesMedia = Papa.parse(csvData, {
  header: true,
});

module.exports = relGalleriesMedia.data;
