const express = require("express");
const { API } = require("../constants/project");
const styles = require("./styles/styles.routes");
const auth = require("./auth/auth.routes");
const users = require("./users/users.routes");
const ropes = require("./ropes/ropes.routes");
const media = require("./media/media.routes");
const climbingRoute = require("./climbingRoutes/climbingRoute.routes");
const grades = require("./grades/grades.routes");
const attempts = require("./attempts/attempts.routes");
const galleries = require("./galleries/galleries.routes");
const { setProviders, getProviders } = require("../utils/upload");
const { Storage } = require("@google-cloud/storage");
const googleCloud = new Storage({
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: JSON.parse(process.env.GOOGLE_CLOUD_PRIVATE_KEY).replace(
      /\\n/g,
      "\n"
    ),
  },
  projectId: "climbing4fun",
});

const router = express.Router();
router.use("/", async (req, res, next) => {
  if (!getProviders()) {
    setProviders("googleCloud", googleCloud.bucket("climbing4fun_prod"));
  }

  next();
});
router.get("/", (req, res) => {
  res.json({ message: API });
});
router.use("/media", media);
router.use("/styles", styles);
router.use("/users", users);
router.use("/ropes", ropes);
router.use("/auth", auth);
router.use("/climbing-routes", climbingRoute);
router.use("/grades", grades);
router.use("/galleries", galleries);
router.use("/attempts", attempts);

module.exports = router;
