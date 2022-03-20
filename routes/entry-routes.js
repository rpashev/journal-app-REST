const express = require("express");

const entryController = require("../controllers/entry-controller");

const router = express.Router();

router.get("/journals/:journalID/:entryID", entryController.getEntry);
router.post("/journals/:journalID/create-entry", entryController.createEntry);
router.patch("/journals/:journalID/:entryID", entryController.updateEntry);
router.delete("/journals/:journalID/:entryID", entryController.deleteEntry);

module.exports = router;
