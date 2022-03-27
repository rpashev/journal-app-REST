const express = require("express");

const catchAsync = require("../middleware/catch-async");
const userController = require("../controllers/user-controller");

const router = express.Router();

router.post("/signup", catchAsync(userController.signup));
router.post("/login", catchAsync(userController.login));

module.exports = router;
