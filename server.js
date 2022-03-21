require("dotenv").config();
const mongoose = require("mongoose");

const app = require("./app");

mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => {
    app.listen(process.env.PORT || 5000, () =>
      console.log("listening on port 5000...")
    );
  })
  .catch((err) => console.log(err));
