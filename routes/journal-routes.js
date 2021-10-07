const express = require("express");

const { journalControllers } = require("../controllers/journal-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/", journalControllers.getAllJournals);
router.get("/:journalID", journalControllers.getJournal);
router.delete("/:journalID", journalControllers.deleteJournal);
router.patch("/:journalID", journalControllers.updateJournal);
router.post("/create-journal", journalControllers.createJournal);

module.exports = router;
