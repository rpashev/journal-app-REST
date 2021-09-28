const HttpError = require("../models/http-error");

const journals = require("../DUMMY_DATA");

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
  const journalIndex = journals.findIndex(
    (journal) => journal.id === journalID
  );
  if (journalIndex < 0) {
    const error = new HttpError(
      "Could not find a journal for the provided ID",
      404
    );
    return next(error);
  }
  journals.splice(journalIndex, 1);
  res.status = 200;
  res.json({ message: "Successfully deleted" });
};

exports.journalControllers = {
  getAllJournals,
  getJournal,
  createJournal,
  deleteJournal,
};
