const express = require("express");
const bodyParser = require("body-parser");

const entryRoutes = require("./routes/entry-routes");
const userRoutes = require("./routes/user-routes");
const journalRoutes = require("./routes/journal-routes");

const app = express();

app.use("/journals", journalRoutes);
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Uknown error occurred!" });
});
// app.use(bodyParser.urlencoded);

app.listen(5000, () => console.log("listening on port 5000..."));
