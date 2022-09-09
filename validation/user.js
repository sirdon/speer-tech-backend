const { check } = require("express-validator");
exports.addBalanceValidation = [
  check("balance").notEmpty().isInt({min:1}).withMessage("please provide a minimum balance"),
];
exports.buyStockValidation = [
  check("quantity").notEmpty().isInt({min:1}).withMessage("please provide a minimum quantity"),
  check("symbol").not().isEmpty().withMessage("symbol is required"),
];
exports.getLiveDataValidation = [
  check("symbol").not().isEmpty().withMessage("symbol is required"),
];
