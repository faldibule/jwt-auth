const express = require("express");
const route = express.Router();
const cookie = require("cookie-parser");
const methodOverride = require("method-override");
const CommentController = require('../controller/commentController')

route.use(methodOverride("_method"));
route.use(cookie());
route.use(express.static("public"));
route.use(express.urlencoded({ extended: true }));

route.post('/comment', CommentController.store)
route.delete('/comment', CommentController.delete)
module.exports = route;