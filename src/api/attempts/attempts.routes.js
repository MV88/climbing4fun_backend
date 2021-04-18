const express = require("express");

const { checkAuth } = require("../auth/auth.utils");
const Attempt = require("./attempts.model");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const attempts = await Attempt.query()
      .withGraphFetched("hasRope(rope)")
      .withGraphFetched("hasStyle(style)")
      .withGraphFetched("hasRoute(route)")
      .withGraphFetched("hasRoute.hasGrade(grade)")
      .select("id", "tries", "climbingDate")
      .orderBy([{ column: "climbingDate", order: "desc" }, "id"])
      .modifiers({
        rope(builder) {
          builder.select("id", "brand", "length", "thickness");
        },
        style(builder) {
          builder.select("id", "name");
        },
        route(builder) {
          builder.select("id", "name", "sector");
        },
        grade(builder) {
          builder.select("french");
        },
      });
    res.status(200).json({
      length: attempts.length,
      result: attempts,
    });
  } catch (e) {
    next(e);
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const attempt = await Attempt.query().where({ id });
    res
      .status(200)
      .json({ result: attempt, message: "attempt fetched correctly" });
  } catch (e) {
    next(e);
  }
});

router.post("/", checkAuth, async (req, res, next) => {
  try {
    const attempt = req.body;
    const attemptCreated = await Attempt.query().insert({
      ...attempt,
      climberId: req.userData.id,
    });

    res.status(200).json({
      result: { attempt: attemptCreated },
      message: "attempt inserted correctly",
    });
  } catch (e) {
    next(e);
  }
});
router.delete("/:id", checkAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    // TODO use soft delete
    const numDeleted = await Attempt.query().deleteById(id);
    res
      .status(200)
      .json({ result: numDeleted, message: "attempt deleted correctly" });
  } catch (e) {
    next(e);
  }
});
router.patch("/:id", checkAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    let attempt = req.body;
    await Attempt.query().findById(id).patch(attempt);
    const attemptPatched = await Attempt.query().where({ id }).first();
    res
      .status(200)
      .json({ result: attemptPatched, message: "attempt patched correctly" });
  } catch (e) {
    next(e);
  }
});
module.exports = router;
