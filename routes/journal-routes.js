const express = require("express");

const router = express.Router();
const journals = require("../DUMMY_DATA");

router.get("/", (req, res, next) => {
  console.log(journals);
  res.json(journals);
  next();
});

module.exports = router;
