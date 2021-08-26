const express = require("express");
const route = express.Router();
const cookie = require("cookie-parser");
const getUserByToken = require("../middleware/getUserByToken");
const verifyToken = require("../middleware/verifyToken");
const methodOverride = require("method-override");
const cekNav = require("../middleware/cekNav");
const upload = require("../middleware/multerConfig");
const UserController = require('../controller/userController')
const userValidator = require('../middleware/userValidator');
const userPasswordValidator = require('../middleware/userPasswordValidator');

route.use(methodOverride("_method"));
route.use(cookie());
route.use(express.static("public"));
route.use(express.urlencoded({ extended: true }));

route.get("*", verifyToken, getUserByToken, cekNav);

route.get('/profile', UserController.form);
route.put('/profile',
        verifyToken, 
        getUserByToken, 
        cekNav,
        userValidator,
        UserController.update);
route.put('/profile/password',
        verifyToken, 
        getUserByToken, 
        cekNav,
        userPasswordValidator,
        UserController.updatePassword);
route.put('/profile/foto', 
        upload.single("image"),
        UserController.updateFoto)

module.exports = route;