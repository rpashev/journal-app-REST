const express = require("express");

const { journalControllers } = require("../controllers/journal-controllers");

const router = express.Router();

router.get("/", journalControllers.getAllJournals);
router.get("/:journalID", journalControllers.getJournal);
router.delete("/:journalID", journalControllers.deleteJournal);
router.post("/create-journal", journalControllers.createJournal);

module.exports = router;
