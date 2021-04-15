const express = require("express");
const User = require("./users.model");
const router = express.Router();

router.get("/", async (req, res) => {
  const users = await User.query()
    .select("id", "email", "name", "created_at", "updated_at")
    .where("deleted_at", null);
  res.json(users);
});

router.post("/", async (req, res, next) => {
  try {
    const user = await User.query().insert(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
