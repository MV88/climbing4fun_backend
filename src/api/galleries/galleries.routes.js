const express = require("express");

const { checkAuth } = require("../auth/auth.utils");
const { upload, getProviders } = require("../../utils/upload");
const Gallery = require("./galleries.model.js");
const Media = require("../media/media.model");
const RelGalleriesMedia = require("./relGalleriesMedia.model");
const { format } = require("util");

const router = express.Router();

router.get("/", checkAuth, async (req, res, next) => {
  try {
    const galleries = await Gallery.query()
      .withGraphFetched("galleryMedia(getMedia)")
      .select("*")
      .modifiers({
        getMedia(builder) {
          builder.select(["media.id", "url"]);
        },
      })
      .withGraphFetched("hasThumbnail(thumbnail)")
      .select("*")
      .modifiers({
        thumbnail(builder) {
          builder.select("media.id", "url");
        },
      });
    res.status(200).json({
      length: galleries.length,
      result: galleries,
      message: "galleries fetched correctly",
    });
  } catch (e) {
    next(e);
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const gallery = await Gallery.query().where({ id });
    res
      .status(200)
      .json({ result: gallery, message: "gallery fetched correctly" });
  } catch (e) {
    next(e);
  }
});
router.post(
  "/",
  checkAuth,
  upload.single("thumbnail"),
  /* upload.array("images"), */ async (req, res, next) => {
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
      res.status(200).json({
        result: { gallery: galleryCreated },
        message: "Gallery inserted correctly",
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
    const numDeleted = await Gallery.query().deleteById(id);
    res
      .status(200)
      .json({ result: numDeleted, message: "gallery deleted correctly" });
  } catch (e) {
    next(e);
  }
});
router.delete("/:galleryId/:mediaId", checkAuth, async (req, res, next) => {
  try {
    const { mediaId } = req.params;
    // TODO use soft delete
    const numDeleted = await Media.query().deleteById(mediaId);
    res
      .status(200)
      .json({ result: numDeleted, message: "media deleted correctly" });
  } catch (e) {
    next(e);
  }
});

router.patch(
  "/:id",
  checkAuth,
  upload.array("files"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const bucket = getProviders();
      console.log("files", req.files);
      if (!req.files) {
        return res
          .status(204)
          .json({ result: null, message: "no files received" });
      }
      req.files.forEach((file, index) => {
        // Create a new blob in the bucket and upload the file data.
        const blob = bucket.file(
          `${new Date().getTime()}_${file.originalname}`
        );
        const blobStream = blob.createWriteStream();

        blobStream.on("error", (err) => {
          next(err);
        });

        blobStream.end(file.buffer);

        blobStream.on("finish", async () => {
          // The public URL can be used to directly access the file via HTTP.
          const url = format(
            `https://storage.googleapis.com/${bucket.name}/${blob.name}`
          );
          const media = {
            name: file.originalname,
            url,
            mimeType: file.mimetype,
            description: file.originalname,
          };

          const mediaCreated = await Media.query().insert(media);
          await RelGalleriesMedia.query().insert({
            mediaId: mediaCreated.id.toString(),
            galleryId: id,
          });
          if (index === req.files.length - 1) {
            res.status(200).json({
              result: null,
              message: "gallery files loaded correctly!",
            });
          }
        });
      });
    } catch (e) {
      next(e);
    }
  }
);
module.exports = router;
