const HttpError = require("../models/http-error");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

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

  if (repeatPassword !== password || password.length < 6) {
    const error = new HttpError(
      "Passwords must match and be at least 6 symbols!",
      400
    );
    return next(error);
  }

  let regex = /\S+@\S+\.\S+/;
  if (regex.test(email) === false || email === "") {
    const error = new HttpError("Invalid email!", 400);
    return next(error);
  }

  if (!firstName || !lastName) {
    const error = new HttpError("Please check your input and try again!", 400);
    return next(error);
  }

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

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user! Please try again later!",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
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

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Signing in failed! Please try again later.",
      500
    );
    return next(error);
  }
  if (!existingUser) {
    const error = new HttpError("Invalid credentials! Could not log in!", 401);
    return next(error);
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not log you in, please check credentials and try again!"
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      "Could not log you in, please check credentials and try again!!"
    );
    return next(error);
  }

  res.json({ message: "Logged in!" });
};

exports.usersControllers = {
  signup,
  login,
};
