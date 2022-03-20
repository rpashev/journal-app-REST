const express = require("express");
const cors = require("cors");

const entryRoutes = require("./routes/entry-routes");
const authRoutes = require("./routes/auth-routes");
const journalRoutes = require("./routes/journal-routes");

const HttpError = require("./models/http-error");
const checkAuth = require("./middleware/check-auth");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route!", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Uknown error occurred!" });
});

module.exports = app;
