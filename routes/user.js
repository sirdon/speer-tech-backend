const express = require('express');
const routes = express.Router();
const UserController = require('../controller/User');
const { validateToken } = require('../controller/Authentication');
const { addBalanceValidation, buyStockValidation, getLiveDataValidation } = require('../validation/user')
const { runValidation } = require("../validation");

routes.put("/add-balance", addBalanceValidation, runValidation, validateToken, UserController.addBalance)
routes.get("/get-user", validateToken, UserController.getUserData)
routes.post("/buy-stock", buyStockValidation, runValidation, validateToken, UserController.buyStock)
routes.post("/sell-stock", buyStockValidation, runValidation, validateToken, UserController.sellStock)
routes.get("/get-protfolio", validateToken, UserController.getPorfolio)
routes.post("/live-subscription", validateToken, UserController.startSubscription)
routes.get("/get-live-data", getLiveDataValidation, runValidation, validateToken, UserController.getLiveData)

module.exports = routes