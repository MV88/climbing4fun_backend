const multer = require("multer");

const storage = multer.memoryStorage();

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

const providers = {};

const setProviders = (name, impl) => {
  providers[name] = impl;
};
const getProviders = (name = "googleCloud") => {
  return providers[name].impl;
};

module.exports = {
  upload,
  setProviders,
  getProviders,
};
