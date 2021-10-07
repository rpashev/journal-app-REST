const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const Journal = require("../models/journal");
const User = require("../models/user");
const { getJournalService } = require("./helpers");

const userID = "615ec626bcee512284118f4f";

const getAllJournals = async (req, res, next) => {
  //for displaying list of journals with names/description so populate needed
  if (!mongoose.Types.ObjectId.isValid(userID)) {
    const error = new HttpError("Invalid credentials!", 400);
    return next(error);
  }

  let journals;
  try {
    journals = await Journal.find({ creator: userID }, "-entries");
    if (journals.length === 0) {
      const error = new HttpError("No existing journals for this user!", 404);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later!",
      500
    );
    return next(error);
  }
  res.json(journals);
};

const getJournal = async (req, res, next) => {
  //for displaying all the entries, needs to check the creator of the journal

  const journalID = req.params.journalID;
  let journal;
  try {
    const result = await getJournalService(userID, journalID);
    if (result.code) {
      return next(result);
    } else {
      journal = result;
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later!",
      500
    );
    return next(error);
  }
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
    creator: userID,
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

const deleteJournal = async (req, res, next) => {
  //needs to delete from journals + user
  const journalID = req.params.journalID;

  if (
    !mongoose.Types.ObjectId.isValid(userID) ||
    !mongoose.Types.ObjectId.isValid(journalID)
  ) {
    const error = new HttpError(
      "Invalid credentials or journal ID! Could not delete!",
      400
    );
    return next(error);
  }

  let journal;
  try {
    journal = await Journal.findById(journalID).populate("creator");

    if (journal.creator.id !== userID) {
      const error = new HttpError("Access denied!", 400);
      return next(error);
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete journal. ",
      500
    );
    return next(error);
  }

  if (!journal) {
    const error = new HttpError("Could not find journal for this id.", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await journal.remove({ session: sess });
    journal.creator.journals.pull(journal);
    await journal.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete journal.",
      500
    );
    return next(error);
  }

  res.json({ message: "Successfully deleted" });
};

const updateJournal = async (req, res, next) => {
  const journalID = req.params.journalID;
  let journal;

  try {
    const result = await getJournalService(userID, journalID);
    if (result.code) {
      return next(result);
    } else {
      journal = result;
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later!",
      500
    );
    return next(error);
  }

  const { journalName, description } = req.body;
  if (!journalName) {
    const error = new HttpError("The journal needs a name!", 400);
    return next(error);
  }

  if (
    journal.journalName === journalName &&
    journal.description === description
  ) {
    const error = new HttpError(
      "Couldn't update, the title and description are the same!"
    );
    return next(error);
  }
  journal.journalName = journalName;
  journal.description = description;

  try {
    await journal.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, couldn't update the journal!",
      500
    );
    return next(error);
  }
  res.status(200).json(journal);
};

exports.journalControllers = {
  getAllJournals,
  getJournal,
  createJournal,
  deleteJournal,
  updateJournal,
};
