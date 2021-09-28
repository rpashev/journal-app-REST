const express = require("express");

const HttpError = require("../models/http-error");

const router = express.Router();
const journals = require("../DUMMY_DATA");

router.get("/", (req, res, next) => {
  console.log(journals);
  res.json(journals);
  next();
});

router.get("/:journalID", (req, res, next) => {
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
});

module.exports = router;
