const mongoose = require("mongoose");
const HttpError = require("../models/http-error");

const { getJournalService } = require("../utils/helpers");

const createEntry = async (req, res, next) => {
  const journalID = req.params.journalID;
  const userID = req.userData.userId;

  let journal;

  // console.log(journalID + "ha")
  const result = await getJournalService(userID, journalID);
  if (result.code) {
    return next(result);
  } else {
    journal = result;
  }

  let { title, body, date } = req.body;
  date = date ? date : new Date();
  title = title ? title : date;

  if (!body) {
    const error = new HttpError("The entry cannot be empty!", 400);
    return next(error);
  }
  const entry = { title, body, date };

  journal.entries.unshift(entry);

  await journal.save();

  res.json(journal);
};

const updateEntry = async (req, res, next) => {
  const { journalID, entryID } = req.params;
  const userID = req.userData.userId;

  if (!mongoose.Types.ObjectId.isValid(entryID)) {
    const error = new HttpError("Invalid entry id!");
    return next(error);
  }

  let journal;

  const result = await getJournalService(userID, journalID);
  if (result.code) {
    return next(result);
  } else {
    journal = result;
  }

  const entry = journal.entries.find((entry) => entry.id === entryID);
  if (!entry) {
    const error = new HttpError(
      "Could not find an entry for the provided ID",
      404
    );
    return next(error);
  }

  let { title, body } = req.body;
  title = title ? title : entry.date.toLocaleDateString("en-GB");

  if (!body) {
    const error = new HttpError("The entry cannot be empty!", 400);
    return next(error);
  }

  if (title === entry.title && body === entry.body) {
    const error = new HttpError("Nothing was changed, could not update!", 400);
    return next(error);
  }

  entry.title = title;
  entry.body = body;

  await journal.save();

  res.status = 200;
  res.json(journal);
};

const deleteEntry = async (req, res, next) => {
  const { journalID, entryID } = req.params;
  const userID = req.userData.userId;
  // console.log(journalID, entryID);
  if (!mongoose.Types.ObjectId.isValid(entryID)) {
    const error = new HttpError("Invalid entry id!");
    return next(error);
  }

  let journal;

  const result = await getJournalService(userID, journalID);
  if (result.code) {
    return next(result);
  } else {
    journal = result;
  }

  const entryIndex = journal.entries.findIndex((entry) => entry.id === entryID);
  if (entryIndex < 0) {
    const error = new HttpError(
      "Could not find an entry for the provided ID",
      404
    );
    return next(error);
  }
  journal.entries.splice(entryIndex, 1);

  await journal.save();

  res.status = 200;
  res.json(journal.entries);
};

const getEntry = async (req, res, next) => {
  const { journalID, entryID } = req.params;
  const userID = req.userData.userId;

  if (!mongoose.Types.ObjectId.isValid(entryID)) {
    const error = new HttpError("Invalid entry id!");
    return next(error);
  }

  let journal;

  const result = await getJournalService(userID, journalID);
  if (result.code) {
    return next(result);
  } else {
    journal = result;
  }

  const entry = journal.entries.find((entry) => entry.id === entryID);
  if (!entry) {
    const error = new HttpError(
      "Could not find an entry for the provided ID!",
      404
    );
    return next(error);
  }
  res.status = 200;
  res.json(entry);
};

module.exports = {
  createEntry,
  updateEntry,
  deleteEntry,
  getEntry,
};
