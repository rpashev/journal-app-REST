const HttpError = require("../models/http-error");

let journals = require("../DUMMY_DATA");

const getAllJournals = (req, res, next) => {
  res.json(journals);
  next();
};

const getJournal = (req, res, next) => {
  const journalID = req.params.journalID;
  const journal = journals.find((journal) => journal.id === journalID);
  if (!journal) {
    const error = new HttpError(
      "Could not find a journal for the provided ID",
      404
    );
    return next(error);
  }
  res.json(journal);
};

const createJournal = (req, res, next) => {
  const { journalName, description } = req.body;
  if (!journalName) {
    const error = new HttpError(
      "Could not craete a journal as journal name is required!",
      400
    );
    return next(error);
  }

  for (let journal of journals) {
    if (journal.journalName === journalName) {
      const error = new HttpError(
        "A journal with this name already exists!",
        400
      );
      return next(error);
    }
  }

  const createdJournal = {
    journalName,
    description,
    id: "journal3",
    entries: [],
  };
  journals.push(createdJournal);
  res.status = 200;
  res.json({ journal: createdJournal });
};

const deleteJournal = (req, res, next) => {
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
