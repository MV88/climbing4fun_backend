const express = require("express");
const Grade = require('./grades.model');

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const grades = await Grade.query();
    res.status(200).json({ length: grades.length, result: grades, message: "All grades retrieved" });
  } catch (e) {
    next(e);
  }
});
router.get("/:gradeId", async (req, res, next) => {
  try {
    const { gradeId } = req.params;
    const grade = await Grade.query().where({ id: gradeId });
    res.status(200).json({ result: grade, message: "grade retrieved" });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
