const express = require("express");
const router = express.Router();

const setupDB = require("../../db/setupDB");
const tableNames = require("../../constants/tableNames");

router.get("/", async (req, res) => {
  const styles = await setupDB(tableNames.style).select("id", "name");
  res.status(200).json({
    length: styles.length,
    result: styles,
    message: "styles fetched correctly",
  });
});
module.exports = router;
