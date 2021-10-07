const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const Journal = require("../models/journal");

const { getJournalService } = require("./helpers");

const userID = "6159cd72b1d83b59a675123f";

const createEntry = async (req, res, next) => {
  const journalID = req.params.journalID;
  let journal;

  try {
    const result = await getJournalService(userID, journalID);
    if (result.message) {
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

  let { title, body } = req.body;
  const date = new Date();
  title = title ? title : date.toLocaleDateString("en-GB");

  if (!body) {
    const error = new HttpError("The entry cannot be empty!", 400);
    return next(error);
  }
  const entry = { title, body, date };

  journal.entries.unshift(entry);
  try {
    await journal.save();
  } catch (err) {
    const error = new HttpError(
      "Could not save entry, something went wrong!",
      500
    );
    return next(error);
  }
  res.json(journal);
};

const updateEntry = (req, res, next) => {
  const { journalID, entryID } = req.params;
  const journal = journals.find((journal) => journal.id === journalID);
  if (!journal) {
    const error = new HttpError(
      "Could not find a journal for the provided ID",
      404
    );
    return next(error);
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
  const entryIndex = journal.entries.findIndex((entry) => entry.id === entryID);
  const updatedEntry = { ...entry, title, body };
  journal.entries[entryIndex] = updatedEntry;
  res.status = 200;
  res.json({ entry: updatedEntry });
};

const deleteEntry = (req, res, next) => {
  const { journalID, entryID } = req.params;
  const journal = journals.find((journal) => journal.id === journalID);
  if (!journal) {
    const error = new HttpError(
      "Could not find a journal for the provided ID",
      404
    );
    return next(error);
  }
  const entryToDelete = journal.entries.find((entry) => entry.id === entryID);
  if (!entryToDelete) {
    const error = new HttpError(
      "Could not find an entry for the provided ID",
      404
    );
    return next(error);
  }
  journal.entries = journal.entries.filter(
    (entry) => entry.id !== entryToDelete.id
  );
  res.status = 200;
  res.json({ entries: journal.entries });
};

exports.entryControllers = {
  createEntry,
  updateEntry,
  deleteEntry,
};
