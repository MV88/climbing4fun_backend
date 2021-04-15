const express = require("express");
const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const { errorHandler, notFound } = require("./src/middlewares/errorHandlers");
const routes = require("./src/api");
const { API } = require("./src/constants/project");

const app = express();
// possibly move json() parsing here
app.use(
  cors({
    credentials: true,
    origin: true,
  })
);
app.use(morgan("tiny"));
app.use(compression());
app.use(helmet());
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: API,
  });
});

app.use("/api/v1", routes);
app.use(notFound);
app.use(errorHandler);

// todo add error handler

module.exports = app;
