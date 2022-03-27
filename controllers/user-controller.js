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

  existingUser = await User.findOne({ email: email });

  if (existingUser) {
    const error = new HttpError(
      "User with such email exists already! Please login instead.",
      422
    );
    return next(error);
  }

  let hashedPassword;

  hashedPassword = await bcrypt.hash(password, 12);

  const createdUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    termsAgreement,
    updatesAgreement,
    journals: [],
  });

  await createdUser.save();

  let token;

  token = jwt.sign(
    {
      userId: createdUser.id,
      email: createdUser.email,
      firstName: createdUser.firstName,
    },
    process.env.JWT_SECRET
    // { expiresIn: "1h" }
  );

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

  existingUser = await User.findOne({ email: email });

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

  // console.log(existingUser.id)
  token = jwt.sign(
    {
      userId: existingUser.id,
      email: existingUser.email,
      firstName: existingUser.firstName,
    },
    process.env.JWT_SECRET
    // { expiresIn: "1h" }
  );

  res.status(201).json({
    userId: existingUser.id,
    email: existingUser.email,
    journals: existingUser.journals,
    firstName: existingUser.firstName,
    token,
  });
};

module.exports = {
  signup,
  login,
};
