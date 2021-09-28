const express = require("express");
const bodyParser = require("body-parser");

const entryRoutes = require("./routes/entry-routes");
const userRoutes = require("./routes/user-routes");
const journalRoutes = require("./routes/journal-routes");

const app = express();

app.use(journalRoutes);
// app.use(bodyParser.urlencoded);

app.listen(5000, () => console.log("listening on port 5000..."));
