const { check } = require("express-validator");
exports.userRegisterValidation = [
  check("username").not().isEmpty().withMessage("Username is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Passwords must be at least 6 characters long"),
];
exports.userLoginValidation = [
  check("username").not().isEmpty().withMessage("Username is required"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Passwords must be at least 6 characters long"),
];