const express = require("express");
const catchAsync = require("../middleware/catch-async");
const weatherApiController = require("../controllers/weather-api-controller");

const router = express.Router();

/**
 * @swagger
 * /locations:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     responses:
 *       200:
 *         description: Successful operation
 *       500:
 *         description: Server error
 */
router.get("/locations", catchAsync(weatherApiController.getAllLocations));
router.delete(
  "/locations/:locationId",
  catchAsync(weatherApiController.deleteLocation)
);
router.post("/locations", catchAsync(weatherApiController.addLocation));
router.post(
  "/locations/all",
  catchAsync(weatherApiController.replaceLocations)
);

module.exports = router;
