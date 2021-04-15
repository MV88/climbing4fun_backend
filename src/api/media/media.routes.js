const express = require("express");
const { checkAuth } = require("../auth/auth.utils");
const { upload } = require("../../utils/upload");
const Media = require("./media.model");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const media = await Media.query();
    res.status(200).json({ result: media, message: "All Media retrieved" });
  } catch (e) {
    next(e);
  }
});
router.get("/:mediaId", async (req, res, next) => {
  try {
    const { id } = req.params;
    const media = await Media.query().select({ id });
    res.status(200).json({ result: media });
  } catch (e) {
    next(e);
  }
});
router.post(
  "/",
  checkAuth,
  upload.single("thumbnail"),
  async (req, res, next) => {
    try {
      let media = req.body;
      media = { ...media, url: `/${req.file.filename}` };

      const mediaCreated = await Media.query().insert(media);
      res
        .status(200)
        .json({ result: mediaCreated, message: "Media inserted correctly" });
    } catch (e) {
      next(e);
    }
  }
);
/*
router.patch("/:ropeId", checkAuth, ropesPatchById);
router.delete("/:ropeId", checkAuth, ropesDeleteById);
*/
module.exports = router;
