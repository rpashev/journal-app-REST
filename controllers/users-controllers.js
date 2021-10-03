const HttpError = require("../models/http-error");
const User = require("../models/user");

const signup = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    repeatPassword,
    termsAgreement,
    updatesAgreement,
  } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed! Please try again later.",
      500
    );
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError(
      "User with such email exists already! Please login instead",
      422
    );
    return next(error);
  }

  const createdUser = new User({
    firstName,
    lastName,
    email,
    password,
    termsAgreement,
    updatesAgreement,
    journals: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed! Please try again later!",
      500
    );
    return next(error);
  }
  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = (req, res, next) => {};

exports.usersControllers = {
  signup,
  login,
};
