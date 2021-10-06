const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const Journal = require("../models/journal");

const getJournalService = async (userID, journalID, callback) => {
  if (
    !mongoose.Types.ObjectId.isValid(userID) ||
    !mongoose.Types.ObjectId.isValid(journalID)
  ) {
    const error = new HttpError("Invalid credentials or journal ID!", 400);
    return callback(error);
  }

  let data;

  try {
    data = await Journal.find({ _id: journalID, _creator: userID });

    if (data.length === 0) {
      const error = new HttpError(
        "Could not find a journal for the provided ID",
        404
      );
      return callback(error);
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later!",
      500
    );

    return callback(error);
  }
  return data[0];
};

exports.getJournalService = getJournalService;
