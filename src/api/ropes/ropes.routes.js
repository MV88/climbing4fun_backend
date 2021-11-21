const express = require("express");
const { format } = require("util");

const { checkAuth } = require("../auth/auth.utils");
const { upload, getProviders } = require("../../utils/upload");
const Rope = require("./ropes.model");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const ropes = await Rope.query()
      .withGraphFetched("hasThumbnail(thumbnail)")
      .select("*")
      .orderBy("id")
      .modifiers({
        thumbnail(builder) {
          builder.select("url");
        },
      });
    res.status(200).json({
      length: ropes.length,
      result: ropes.map((rope) => {
        return { ...rope, owner: rope.ownerId ? "yes" : "no" };
      }),
    });
  } catch (e) {
    next(e);
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const rope = await Rope.query().where({ id });
    res
      .status(200)
      .json({ result: { ...rope, owner: rope.ownerId ? "yes" : "no" } });
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
      const rope = req.body;
      if (req.file) {
        const bucket = getProviders();
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
            rope.ownerName = "";
            delete rope.owner;
          }
          const ropeCreated = await Rope.query().insertGraph({
            ...rope,
            hasThumbnail: media,
          });
          if (rope.owner === "yes") {
            rope.owner = "yes";
          }
          ropeCreated.url = url;
          res.status(200).json({
            result: { rope: ropeCreated },
            message: "Rope inserted correctly",
          });
          console.log("publicUrl", url);
        });
      } else {
        if (rope.purchaseDate === "") {
          delete rope.purchaseDate;
        }

        if (rope.owner === "yes") {
          rope.ownerId = req.userData.id;
          rope.ownerName = "";
          delete rope.owner;
        }
        const ropeCreated = await Rope.query().insertGraph(rope);
        if (rope.owner === "yes") {
          rope.owner = "yes";
        }
        ropeCreated.url = "url";
        res.status(200).json({
          result: { rope: ropeCreated },
          message: "Rope inserted correctly",
        });
      }
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
router.patch(
  "/:id",
  checkAuth,
  upload.single("thumbnail"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      let rope = req.body;
      delete rope.owner;
      rope = Object.keys(rope).reduce((obj, key) => {
        return rope[key] ? { ...obj, [key]: rope[key] } : obj;
      }, {});
      await Rope.query().findById(id).patch(rope);
      const ropePatched = await Rope.query().where({ id }).first();
      res
        .status(200)
        .json({ result: ropePatched, message: "rope patched correctly" });
    } catch (e) {
      next(e);
    }
  }
);
module.exports = router;
