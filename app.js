const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const compression = require("compression");

const entryRoutes = require("./routes/entry-routes");
const authRoutes = require("./routes/auth-routes");
const journalRoutes = require("./routes/journal-routes");
const weatherApiRoutes = require("./routes/weather-api-routes");

const HttpError = require("./models/http-error");
const checkAuth = require("./middleware/check-auth");

const app = express();

app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10kb" }));

app.use(mongoSanitize());

app.use(hpp());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
});
app.use(limiter);

app.use(compression());

app.use(
  cors({
    credentials: true,
    origin: true,
  })
);

app.use("/auth", authRoutes);

app.use(checkAuth);

app.use("/journals", journalRoutes);
app.use(entryRoutes);
app.use("/weather-api", weatherApiRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route!", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  // console.log("here");
  res.status(error.code || 500);
  res.json({ message: error.message || "Something went wrong!" });
});

module.exports = app;
