const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const locationSchema = new Schema({
  city: {
    type: String,
    required: [true, "City name is required"],
    maxLenght: [60, "Cuty name can't be more than 40 characters"],
  },
  creator: {
    type: mongoose.Types.ObjectId,
    required: [true, "Creator ID is required"],
    ref: "User",
  },
  lat: {
    type: Number,
    required: [true, "Latitude is required"],
  },
  lon: {
    type: Number,
    required: [true, "Longitude is required"],
  },
  country: {
    type: String,
    required: [true, "Country name is required"],
  },
});

module.exports = mongoose.model("Location", locationSchema);
