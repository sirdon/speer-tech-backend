const { check } = require("express-validator");
exports.tweetListValidation = [
  check("content").not().isEmpty().withMessage("tweet content is required"),
];
exports.tweetGetValidation = [
  check("tweetId").isMongoId().withMessage("Please provide a valid tweet id"),
];
