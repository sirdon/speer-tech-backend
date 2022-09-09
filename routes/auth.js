const express = require('express');
const routes = express.Router();
const AuthController = require('../controller/Authentication');
const { userRegisterValidation, userLoginValidation } = require('../validation/auth')
const { runValidation } = require("../validation");
routes.post("/register", userRegisterValidation, runValidation, AuthController.register)
routes.post("/login", userLoginValidation, runValidation, AuthController.login)
routes.post("/logout", AuthController.logout)
module.exports = routes