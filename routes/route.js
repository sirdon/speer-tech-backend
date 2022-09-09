const express = require('express');
const routes = express.Router();
const AuthRoute = require('./auth');
const TweetRoute = require('./tweet');
const UserRoute = require('./user');
const addListedStock = require('../controller/Stock').addListedStock
routes.use("/auth", AuthRoute)
routes.use("/tweet", TweetRoute)
routes.use("/stock", UserRoute)
routes.use("/addStockData", addListedStock)
module.exports = routes