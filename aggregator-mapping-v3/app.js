const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const timeout = require("connect-timeout");

const indexRouter = require("./routes/index");
const masterRoutes = require("./routes/master.routes");
const routes = require("./routes/routes");
const routesAlternate = require("./routes/routes.alternate");
const sendResponse = require("./app/resources/responseApi");

const app = express();

// Allow requests from a specific origin (your frontend app)
// const allowedOrigins = ['https://jm-click-dev.jasamarga.co.id'];

// const corsOption = {
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// }

// const nodeEnv = process.env.NODE_ENV || 'public';

// if (nodeEnv === 'public') {
//   app.use(cors(corsOption));
// } else {
// }
app.use(cors());

app.use(timeout("5000s"));
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self';");
  res.setHeader("X-Frame-Options", "SAMEORIGIN always;");
  next();
});

app.use(
  express.json({
    limit: "50mb",
  })
); // add 05.05.2023 #load 1000 data
app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
app.use("/api/v1/master", masterRoutes);
app.use("/api/v1", routes);
app.use("/api/alternate", routesAlternate);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;

  if (error.message == "Not Found") {
    return next(createError(404));
  }

  if (
    error.message == ".png or .jpg File Only!" ||
    error.message == "MulterError: File too large"
  ) {
    if (error.message == "MulterError: File too large") {
      error.message = "File is too large, Max of 2MB";
    }
    return res
      .status(422)
      .send(sendResponse.unprocessableEntityFile(error.message));
  }

  if (status == 422) {
    return res
      .status(status)
      .send(sendResponse.unprocessableEntityFile(error.message));
  }

  if (status == 403) {
    return res.status(status).send(sendResponse.forbidden(error.message));
  }

  if (status == 404) {
    return res.status(404).send(sendResponse.dataNotFoundException());
  }

  if (status == 409) {
    return res.status(409).send(sendResponse.resourceExist(error.message));
  }

  if (status == 401) {
    return res.status(401).send(sendResponse.unauthorized(error.message));
  }

  return res.status(status).send(sendResponse.internalServerError());
});

const server = require("http").Server(app);

module.exports = {
  app,
  server,
};
