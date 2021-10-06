const HttpError = require("../models/http-error");

const journals = require("../DUMMY_DATA");

const createEntry = async(req, res, next) => {
  const journalID = req.params.journalID;
  const journal = journals.find((journal) => journal.id === journalID);
  if (!journal) {
    const error = new HttpError(
      "Could not find a journal for the provided ID",
      404
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

  const createdEntry = { title, body, date, id: "entry4" };
  journal.entries.unshift(createdEntry);
  res.status = 200;
  res.json({ entry: createdEntry });
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
