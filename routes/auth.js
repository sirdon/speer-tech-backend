const express = require('express');
const routes = express.Router();
const AuthController = require('../controller/Authentication');
const { userRegisterValidation, userLoginValidation } = require('../validation/auth')
const { runValidation } = require("../validation");
routes.post("/register",userRegisterValidation, runValidation, AuthController.register)
routes.get("/login", userLoginValidation, runValidation, AuthController.login)
routes.get("/logout", AuthController.logout)
module.exports = routes