const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const journalSchema = new Schema({
  journalName: { type: String, required: true },
  description: String,
  creator: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  entries: [
    {
      title: String,
      body: { type: String, required: true },
      date: { type: Date, default: new Date() },
    },
  ],
});

module.exports = mongoose.model("Journal", journalSchema);
