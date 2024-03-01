const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: [true, "First name is required"] },
  lastName: { type: String, required: [true, "Last name is required"] },
  email: { type: String, required: [true, "Email is required"], unique: true },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
  },
  termsAgreement: { type: Boolean, default: false },
  updatesAgreement: { type: Boolean, default: false },
  journals: [{ type: mongoose.Types.ObjectId, ref: "Journal" }],
  trackedLocations: [{ type: mongoose.Types.ObjectId, ref: "Location" }],
});

module.exports = mongoose.model("User", userSchema);
