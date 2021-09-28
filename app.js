const express = require("express");

const HttpError = require("./models/http-error");

const entryRoutes = require("./routes/entry-routes");
const userRoutes = require("./routes/user-routes");
const journalRoutes = require("./routes/journal-routes");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/journals", journalRoutes);
// app.use("/journals/:journalID", entryRoutes);
app.use(entryRoutes);
app.use("/auth", userRoutes);

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

app.listen(5000, () => console.log("listening on port 5000..."));
