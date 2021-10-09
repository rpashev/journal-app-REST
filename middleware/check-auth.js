const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    
    if (!token) {
      // console.log(req.headers.authorization)
      throw new Error("Authentication failed! Access denied!", 401);
    }
    const decodedToken = jwt.verify(
      token,
      "very_secret_do_not_share_me_sad_face"
    );
console.log(token)
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    const error = new Error("Authentication failed! Access denied!", 401);
    return next(error);
  }
};
