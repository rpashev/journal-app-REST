const express = require("express");
const mongoose = require("mongoose");

const entryRoutes = require("./routes/entry-routes");
const authRoutes = require("./routes/auth-routes");
const journalRoutes = require("./routes/journal-routes");

const HttpError = require("./models/http-error");
const checkAuth = require("./middleware/check-auth");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});
app.use("/auth", authRoutes);

app.use(checkAuth)

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

mongoose
  .connect(
    "mongodb://rosko_kz:Rossen91kz@cluster0-shard-00-00.cpss2.mongodb.net:27017,cluster0-shard-00-01.cpss2.mongodb.net:27017,cluster0-shard-00-02.cpss2.mongodb.net:27017/journal-app?ssl=true&replicaSet=atlas-dg8hi2-shard-0&authSource=admin&retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5000, () => console.log("listening on port 5000..."));
  })
  .catch((err) => console.log(err));
