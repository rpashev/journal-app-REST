const express = require("express");

const journalController = require("../controllers/journal-controller");

const router = express.Router();

router.get("/", journalController.getAllJournals);
router.get("/:journalID", journalController.getJournal);
router.delete("/:journalID", journalController.deleteJournal);
router.patch("/:journalID", journalController.updateJournal);
router.post("/create-journal", journalController.createJournal);

module.exports = router;
