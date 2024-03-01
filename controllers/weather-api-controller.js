const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const Location = require("../models/weather-api/locations");
const User = require("../models/user");

const getAllLocations = async (req, res, next) => {
  const userId = req.userData.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new HttpError("Invalid credentials!", 400);
    return next(error);
  }
  let user;
  user = await User.findById(userId).populate("trackedLocations");

  if (!user) {
    const error = new HttpError("No such user!", 404);
    return next(error);
  }

  let locations;

  if (user.trackedLocations?.length === 0) {
    return res.json([]);
  }

  locations = user.trackedLocations.map((location) => {
    return {
      id: location._id,
      lat: location.lat,
      lon: location.lon,
      city: location.city,
      country: location.country,
    };
  });

  res.json({ locations });
};

const addLocation = async (req, res, next) => {
  const userId = req.userData.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const error = new HttpError(
      "Invalid credentials, could not create journal!",
      400
    );
    return next(error);
  }

  const { lat, lon, country, city } = req.body;

  if (typeof lon !== "number" || typeof lat !== "number" || !country || !city) {
    const error = new HttpError("Could not add location, invalid data!", 400);
    return next(error);
  }

  const createdLocation = new Location({
    lat,
    lon,
    creator: userId,
    city,
    country,
  });

  let user;

  user = await User.findById(userId).populate("trackedLocations");

  if (!user) {
    const error = new HttpError("No such user!", 404);
    return next(error);
  }

  if (user.trackedLocations?.length > 0) {
    const existingLocation = user.trackedLocations.find(
      (location) =>
        location.city.trim() === city && location.country.trim() === country
    );
    if (existingLocation) {
      const error = new HttpError("This location was already added!", 400);
      return next(error);
    }
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();

    await createdLocation.save({ session: sess });
    user.trackedLocations.push(createdLocation._id);
    await user.save({ session: sess });

    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Adding location failed, please try again later!",
      500
    );
    return next(error);
  }
  res.json({ createdLocation });
};

const deleteLocation = async (req, res, next) => {
  const userId = req.userData.userId;

  const locationId = req.params.locationId;

  if (
    !mongoose.Types.ObjectId.isValid(userId) ||
    !mongoose.Types.ObjectId.isValid(locationId)
  ) {
    const error = new HttpError(
      "Invalid credentials or location! Could not delete!",
      400
    );
    return next(error);
  }

  let location;

  location = await Location.findById(locationId).populate("creator");
  if (!location) {
    const error = new HttpError("Could not find location for this id.", 404);
    return next(error);
  }

  if (location.creator.id !== userId) {
    const error = new HttpError("Access denied!", 400);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await location.remove({ session: sess });
    location.creator.trackedLocations.pull(location);
    await location.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete journal.",
      500
    );
    return next(error);
  }

  res.json(null);
};

module.exports = {
  getAllLocations,
  addLocation,
  deleteLocation,
};
