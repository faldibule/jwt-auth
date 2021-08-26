const express = require("express");
const getUserByToken = require("../middleware/getUserByToken");
const route = express.Router();
const cookie = require("cookie-parser");
const verifyToken = require("../middleware/verifyToken");
const methodOverride = require("method-override");
const PostController = require("../controller/postController");
const cekNav = require("../middleware/cekNav");
const upload = require("../middleware/multerConfig");
const postValidator = require('../middleware/postvalidator')
const { body, check } = require('express-validator');


route.use(methodOverride("_method"));
route.use(cookie());
route.use(express.static("public"));
route.use(express.urlencoded({ extended: true }));


route.get("/post", PostController.find);
route.get("*", verifyToken, getUserByToken, cekNav);
route.get("/post/form-post", PostController.form);
route.get("/post/detail/:id", PostController.detail);
route.get("/post/update/:id", PostController.updateForm);
route.get('/post/search', PostController.search)
route.delete("/post", 
        getUserByToken, 
        PostController.delete);

route.post("/post",
        getUserByToken,
        upload.single("image"),
        postValidator,
        PostController.store);
route.put("/post", 
        verifyToken, 
        getUserByToken, 
        upload.single("image"),
        postValidator, 
        PostController.update);

module.exports = route;
