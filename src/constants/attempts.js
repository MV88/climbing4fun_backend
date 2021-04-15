const fs = require("fs");
const path = require("path");
const Papa = require("papaparse");

const csvData = fs.readFileSync(
  path.join(__dirname, "..", "..", "src", "db", "sources", "attempts.csv"),
  "utf8"
);

const attempts = Papa.parse(csvData, {
  header: true,
});

module.exports = attempts.data;
