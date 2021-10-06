const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const Journal = require("../models/journal");
const User = require("../models/user");

const userID = "6159cd86b1d83b59a675123f";

const getAllJournals = (req, res, next) => {
  //for displaying list of journals with names/description so populate needed
  res.json(journals);
  next();
};

const getJournal = async (req, res, next) => {
  //for displaying all the entries, needs to check the creator of the journal

  const journalID = req.params.journalID;

  if (
    !mongoose.Types.ObjectId.isValid(userID) ||
    !mongoose.Types.ObjectId.isValid(journalID)
  ) {
    const error = new HttpError("Invalid credentials or journal ID!", 400);
    return next(error);
  }
  let journal;
  let data;

  try {
    data = await Journal.find({ _id: journalID, creatorID: userID });
    if (data.length === 0) {
      const error = new HttpError(
        "Could not find a journal for the provided ID",
        404
      );
      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later!",
      500
    );
    return next(error);
  }
  journal = data[0];
  res.json(journal);
};

const createJournal = async (req, res, next) => {
  const { journalName, description } = req.body;
  if (!journalName) {
    const error = new HttpError(
      "Could not craete a journal as journal name is required!",
      400
    );
    return next(error);
  }

  if (!mongoose.Types.ObjectId.isValid(userID)) {
    const error = new HttpError(
      "Invalid credentials, could not create journal!",
      400
    );
    return next(error);
  }

  const createdJournal = new Journal({
    journalName,
    description,
    creatorID: userID,
    entries: [],
  });

  let user;
  try {
    user = await User.findById(userID).populate("journals");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong! Please try again later.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("No such user!", 404);
    return next(error);
  }

  if (user.journals.length > 0) {
    const journal = user.journals.find(
      (journal) => journal.journalName === journalName
    );
    if (journal) {
      const error = new HttpError(
        "A journal with this name already exists!",
        400
      );
      return next(error);
    }
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdJournal.save({ session: sess });
    user.journals.push(createdJournal._id);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Creating journal failed, please try again later!",
      500
    );
    return next(error);
  }
  res.json({ journal: createdJournal });
};

const deleteJournal = (req, res, next) => {
  //needs to delete from journals + user
  const journalID = req.params.journalID;

  if (!journalID) {
    const error = new HttpError(
      "Could not find a journal for the provided ID",
      404
    );
    return next(error);
  }
  journals = journals.filter((journal) => journal.id !== journalID);
  res.status = 200;
  res.json({ message: "Successfully deleted" });
};

exports.journalControllers = {
  getAllJournals,
  getJournal,
  createJournal,
  deleteJournal,
};
