const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join('./static'));
  },
  filename: (req, file, cb) => {
    cb(null, (`${new Date().getTime()} ${file.originalname}`).replace(":", "-"));
  },
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    // accept a file
    cb(null, true);
  } else {
    // reject a file
    cb(null, false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter,
});

module.exports = upload;
