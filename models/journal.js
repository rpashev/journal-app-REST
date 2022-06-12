const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const journalSchema = new Schema({
  journalName: {
    type: String,
    required: [true, "Journal name is required"],
    maxLenght: [40, "Journal name can't be more than 40 characters"],
  },
  description: String,
  creator: {
    type: mongoose.Types.ObjectId,
    required: [true, "Creator ID is required"],
    ref: "User",
  },
  entries: [
    {
      title: String,
      body: { type: String, required: [true, "Entry body is required"] },
      date: { type: Date, default: new Date() },
    },
  ],
});

module.exports = mongoose.model("Journal", journalSchema);
