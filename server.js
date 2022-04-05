require("dotenv").config();
const mongoose = require("mongoose");

const app = require("./app");

const port = process.env.PORT || 5000;

mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => {
    app.listen(process.env.PORT || 5000, () =>
      console.log(`listening on port ${port}...`)
    );
  })
  .catch((err) => console.log(err));
