const express = require("express");
const catchAsync = require("../middleware/catch-async");
const journalController = require("../controllers/journal-controller");

const router = express.Router();

router.get("/", catchAsync(journalController.getAllJournals));
router.get("/:journalID", catchAsync(journalController.getJournal));
router.delete("/:journalID", catchAsync(journalController.deleteJournal));
router.patch("/:journalID", catchAsync(journalController.updateJournal));
router.post("/create-journal", catchAsync(journalController.createJournal));

module.exports = router;
