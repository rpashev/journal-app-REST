const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  termsAgreement: { type: Boolean, default: false },
  updatesAgreement: { type: Boolean, default: false },
  journals: [{ type: mongoose.Types.ObjectId, ref: "Journal" }],
});

// userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
