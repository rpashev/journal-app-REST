const express = require("express");
const catchAsync = require("../middleware/catch-async");
const weatherApiController = require("../controllers/weather-api-controller");

const router = express.Router();

router.get("/locations", catchAsync(weatherApiController.getAllLocations));
router.delete(
  "/locations/:locationId",
  catchAsync(weatherApiController.deleteLocation)
);
router.post("/locations", catchAsync(weatherApiController.addLocation));

module.exports = router;
