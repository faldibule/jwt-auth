const express = require("express");
const route = express.Router();
const AuthController = require("../controller/authController");
const cekNav = require('../middleware/cekNav')
const regisValidator = require('../middleware/regisValidator')

require("../utils/db");
route.use(express.static("public"));
route.use(express.urlencoded({ extended: true }));
route.get("*", cekNav);

route.get("/login", AuthController.loginPage);
route.post("/register", 
        regisValidator,
        AuthController.register);
route.post("/login", AuthController.login);
route.get("/logout", AuthController.logout);

module.exports = route;
