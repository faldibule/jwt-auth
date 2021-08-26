const jwt = require("jsonwebtoken");
const User = require("../models/user");

const getUserByToken = (req, res, next) => {
  const userToken = req.cookies.userToken;

  if (typeof userToken != "undefined") {
    jwt.verify(userToken, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.locals.user = null;
        next();
      } else {
        // console.log(decodedToken);
        let user = await User.findById(decodedToken._id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    next();
  }
};
module.exports = getUserByToken;
