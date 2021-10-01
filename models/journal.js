const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const journalSchema = new Schema({
  journalName: { type: String, required: true },
  description: String,
  creatorID: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  entries: [
    {
      id: { type: mongoose.Types.ObjectId, required: true },
      title: String,
      body: { type: String, required: true },
      date: { type: Date, default: new Date() },
    },
  ],
});

model.exports = mongoose.model("Journal", userSchema);
