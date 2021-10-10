const express = require("express");

const { entryControllers } = require("../controllers/entry-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/journals/:journalID/:entryID", entryControllers.getEntry);
router.post("/journals/:journalID/create-entry", entryControllers.createEntry);
router.patch("/journals/:journalID/:entryID", entryControllers.updateEntry);
router.delete("/journals/:journalID/:entryID", entryControllers.deleteEntry);

module.exports = router;
