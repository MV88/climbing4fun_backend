const express = require("express");
const router = express.Router();

const setupDB = require('../../db/setupDB');
const tableNames = require('../../constants/tableNames');

router.get("/", async (req, res) => {
  const styles = await setupDB(tableNames.style).select("id", "name");
  res.json(styles);
});
module.exports = router;
