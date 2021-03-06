const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const Journal = require("../models/journal");
const User = require("../models/user");
const { getJournalService } = require("../utils/helpers");

const getAllJournals = async (req, res, next) => {
  const userId = req.userData.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new HttpError("Invalid credentials!", 400);
    return next(error);
  }

  let journals;

  journals = await Journal.find({ creator: userId });
  if (journals.length === 0) {
    return res.json([]);
  }

  journals = journals.map((journal) => {
    return {
      id: journal._id,
      journalName: journal.journalName,
      entriesAmount: journal.entries.length,
    };
  });

  res.json(journals);
};

const getJournal = async (req, res, next) => {
  //for displaying all the entries, needs to check the creator of the journal
  const userId = req.userData.userId;

  const journalID = req.params.journalID;
  let journal;

  const result = await getJournalService(userId, journalID);
  if (result.code) {
    return next(result);
  } else {
    journal = result;
  }

  res.json(journal);
};

const createJournal = async (req, res, next) => {
  const journalName = req.body.journalName.trim();
  const { description } = req.body;
  const userId = req.userData.userId;

  if (!journalName || journalName.length > 40) {
    const error = new HttpError(
      "Could not craete a journal as journal name is required and must be at most 40 characters!",
      400
    );
    return next(error);
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new HttpError(
      "Invalid credentials, could not create journal!",
      400
    );
    return next(error);
  }

  const createdJournal = new Journal({
    journalName,
    description,
    creator: userId,
    entries: [],
  });

  let user;

  user = await User.findById(userId).populate("journals");

  if (!user) {
    const error = new HttpError("No such user!", 404);
    return next(error);
  }

  if (user.journals.length > 0) {
    const journal = user.journals.find(
      (journal) => journal.journalName.trim() === journalName
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
  const userId = req.userData.userId;

  const journalID = req.params.journalID;

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(journalID)
  ) {
    const error = new HttpError(
      "Invalid credentials or journal ID! Could not delete!",
      400
    );
    return next(error);
  }

  let journal;

  journal = await Journal.findById(journalID).populate("creator");

  if (journal.creator.id !== userId) {
    const error = new HttpError("Access denied!", 400);
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
  const userId = req.userData.userId;

  const journalID = req.params.journalID;
  let journal;
  let user;

  const result = await getJournalService(userId, journalID);
  if (result.code) {
    return next(result);
  } else {
    journal = result;
  }

  const { description } = req.body;
  const journalName = req.body.journalName.trim();

  user = await User.findById(userId).populate("journals");

  if (!user) {
    const error = new HttpError("No such user!", 404);
    return next(error);
  }

  if (user.journals.length > 0) {
    const journal = user.journals.find(
      (journal) => journal.journalName.trim() === journalName
    );
    if (journal && journal.id !== journalID) {
      const error = new HttpError(
        "A journal with this name already exists!",
        400
      );
      return next(error);
    }
  }
  if (!journalName || journalName.length > 40) {
    const error = new HttpError(
      "The journal needs a name and it must be at most 40 characters!",
      400
    );
    return next(error);
  }

  if (
    journal.journalName.trim() === journalName &&
    journal.description === description
  ) {
    const error = new HttpError(
      "Couldn't update, the title and description are the same!"
    );
    return next(error);
  }
  journal.journalName = journalName;
  journal.description = description;

  await journal.save();

  res.status(200).json(journal);
};

module.exports = {
  getAllJournals,
  getJournal,
  createJournal,
  deleteJournal,
  updateJournal,
};
