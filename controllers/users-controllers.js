const HttpError = require("../models/http-error");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
      "User with such email exists already! Please login instead.",
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
  let token;
  try {
    token = jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.email,
        firstName: createdUser.firstName,
      },
      "very_secret_do_not_share_me_sad_face",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed! Please try again later!",
      500
    );
    return next(error);
  }

  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.email,
    journals: createdUser.journals,
    firstName: createdUser.firstName,
    token,
  });
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
      "Could not log you in, please check credentials and try again!!",
      401
    );
    return next(error);
  }

  let token;
  try {
    // console.log(existingUser.id)
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
        firstName: existingUser.firstName,
      },
      "very_secret_do_not_share_me_sad_face",
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Signing up failed! Please try again later!",
      500
    );
    return next(error);
  }

  res.status(201).json({
    userId: existingUser.id,
    email: existingUser.email,
    journals: existingUser.journals,
    firstName: existingUser.firstName,
    token,
  });
};

exports.usersControllers = {
  signup,
  login,
};
