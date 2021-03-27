const express = require("express");
const { format } = require("util");
const { Storage } = require("@google-cloud/storage");

const { checkAuth } = require("../auth/auth.utils");
const { upload } = require("../../utils/upload");
const Rope = require("./ropes.model");
const path = require("path");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const ropes = await Rope.query()
      .withGraphFetched("hasThumbnail(thumbnail)")
      .select("*")
      .modifiers({
        thumbnail(builder) {
          builder.select("url");
        },
      });
    res.status(200).json({ length: ropes.length, result: ropes });
  } catch (e) {
    next(e);
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const rope = await Rope.query().where({ id });
    res.status(200).json({ result: rope });
  } catch (e) {
    next(e);
  }
});

const googleCloud = new Storage({
  credentials: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  projectId: "climbing4fun",
});
const bucket = googleCloud.bucket("climbing4fun_prod");

router.post(
  "/",
  checkAuth,
  upload.single("thumbnail"),
  async (req, res, next) => {
    try {
      const rope = req.body;

      // Create a new blob in the bucket and upload the file data.
      const blob = bucket.file(
        `${new Date().getTime()}_${req.file.originalname}`
      );
      const blobStream = blob.createWriteStream();

      blobStream.on("error", (err) => {
        next(err);
      });

      blobStream.end(req.file.buffer);

      blobStream.on("finish", async () => {
        // The public URL can be used to directly access the file via HTTP.
        const url = format(
          `https://storage.googleapis.com/${bucket.name}/${blob.name}`
        );
        const media = {
          name: `${rope.brand} ${rope.color}`,
          url,
          mimeType: req.file.mimetype,
          description: req.file.originalname,
        };
        if (rope.purchaseDate === "") {
          delete rope.purchaseDate;
        }

        if (rope.owner === "yes") {
          rope.ownerId = req.userData.id;
          rope.owner = "";
        } else {
          rope.owner = rope.ownerName;
        }
        delete rope.ownerName;
        const ropeCreated = await Rope.query().insertGraph({
          ...rope,
          hasThumbnail: media,
        });
        ropeCreated.url = url;
        res.status(200).json({
          result: { rope: ropeCreated },
          message: "Rope inserted correctly",
        });
        console.log("publicUrl", url);
      });
    } catch (e) {
      next(e);
    }
  }
);
router.delete("/:id", checkAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    // TODO use soft delete
    const numDeleted = await Rope.query().deleteById(id);
    res
      .status(200)
      .json({ result: numDeleted, message: "rope deleted correctly" });
  } catch (e) {
    next(e);
  }
});
router.patch("/:id", checkAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const rope = req.body;
    await Rope.query().findById(id).patch(rope);
    const ropePatched = await Rope.query().where({ id }).first();
    res
      .status(200)
      .json({ result: ropePatched, message: "rope patched correctly" });
  } catch (e) {
    next(e);
  }
});
module.exports = router;
