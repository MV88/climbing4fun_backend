
const express = require("express");

const { checkAuth } = require('../auth/auth.utils');
const upload = require('../../utils/upload');
const Gallery = require('./galleries.model');

const router = express.Router();

router.get("/", checkAuth, async (req, res, next) => {
  try {
    const galleries = await Gallery.query()
      .withGraphFetched('galleryMedia(getMedia)')
      .select("*")
      .modifiers({
        getMedia (builder) {
          builder.select('url');
        },
      }).withGraphFetched('hasThumbnail(thumbnail)')
      .select("*")
      .modifiers({
        thumbnail (builder) {
          builder.select('url');
        },
      });
    res.status(200).json({ length: galleries.length, result: galleries, message: "galleries fetched correctly" });
  } catch (e) {
    next(e);
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.query().where({ id });
    res.status(200).json({ result: gallery, message: "gallery fetched correctly" });
  } catch (e) {
    next(e);
  }
});
router.post("/", checkAuth, upload.single("thumbnail"), /* upload.array("images"), */ async (req, res, next) => {
  try {
    const gallery = req.body;
    const url = `/${req.file.filename}`;

    const thumbnail = {
      name: `${gallery.title}`,
      url,
      mimeType: req.file.mimetype,
      description: req.file.filename,
    };
    /*
    const media = req.files.map(media => ({
      name: `${media.filename}`,
      url,
      mimeType: media.mimetype,
      description: media.filename,
    }));
    const mediaCreated = await Gallery.query().insert(media);
    */

    const galleryCreated = await Gallery.query().insertGraph({
      ...gallery,
      userId: req.userData.id,
      hasThumbnail: {
        ...thumbnail,
      },
      /* galleryMedia: [mediaCreated.map(({ id }) => ({
        mediaId: id,
      })),
      ], */
    });
    galleryCreated.thumbnail = url;
    res.status(200).json({ result: { gallery: galleryCreated }, message: "Gallery inserted correctly" });
  } catch (e) {
    next(e);
  }
});
router.delete("/:id", checkAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    // TODO use soft delete
    const numDeleted = await Gallery.query().deleteById(id);
    res.status(200).json({ result: numDeleted, message: "gallery deleted correctly" });
  } catch (e) {
    next(e);
  }
});
router.patch("/:id", checkAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const rope = req.body;
    await Gallery.query().findById(id).patch(rope);
    const ropePatched = await Gallery.query()
      .where({ id })
      .first();
    res.status(200).json({ result: ropePatched, message: "rope patched correctly" });
  } catch (e) {
    next(e);
  }
});
module.exports = router;