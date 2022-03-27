const express = require("express");

const catchAsync = require("../middleware/catch-async");
const entryController = require("../controllers/entry-controller");

const router = express.Router();

router.get(
  "/journals/:journalID/:entryID",
  catchAsync(entryController.getEntry)
);
router.post(
  "/journals/:journalID/create-entry",
  catchAsync(entryController.createEntry)
);
router.patch(
  "/journals/:journalID/:entryID",
  catchAsync(entryController.updateEntry)
);
router.delete(
  "/journals/:journalID/:entryID",
  catchAsync(entryController.deleteEntry)
);

module.exports = router;
