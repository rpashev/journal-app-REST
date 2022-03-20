require("dotenv").config();
const mongoose = require("mongoose");

const app = require("./app");

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
