require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const history = require("connect-history-api-fallback");
const entryRoutes = require("./routes/entry-routes");
const authRoutes = require("./routes/auth-routes");
const journalRoutes = require("./routes/journal-routes");

const HttpError = require("./models/http-error");
const checkAuth = require("./middleware/check-auth");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(history());

app.use(
  cors({
    credentials: true,
    // origin: 'http://localhost:8080'
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

mongoose
  .connect(
    `mongodb://${process.env.USER_MONGO}:${process.env.USER_MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}-shard-00-00.cpss2.mongodb.net:27017,${process.env.MONGO_CLUSTER}-shard-00-01.cpss2.mongodb.net:27017,${process.env.MONGO_CLUSTER}-shard-00-02.cpss2.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-dg8hi2-shard-0&authSource=admin&retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT || 5000, () =>
      console.log("listening on port 5000...")
    );
  })
  .catch((err) => console.log(err));
