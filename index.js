const express = require("express");
const app = express();
const dotenv = require('dotenv')
dotenv.config()
const port = process.env.PORT || 3000;
// const verifyToken = require("./middleware/verifyToken");
const cookie = require("cookie-parser");
const session = require('express-session')
const flash = require('connect-flash')
const expressLayouts = require("express-ejs-layouts");
const auth = require("./route/authRoute");
const post = require("./route/postRoute");
const user = require('./route/userRoute');
const comment = require('./route/commentRoute')
const getUserByToken = require("./middleware/getUserByToken");
const cekNav = require("./middleware/cekNav");



app.set("view engine", "ejs");

app.use(expressLayouts);
app.use(cookie());
app.use(session({
  secret: 'secret',
  cookie: {
          maxAge: 60000
  },
  resave: false,
  saveUninitialized: false,
}))
app.use(flash())

app.get("*", getUserByToken, cekNav);
app.get("/", (req, res) => {
  const cekNav = res.locals.nav;
  res.render("index", {
    title: "Halaman Index",
    layout: "layouts/main",
    cekNav,
  });
});

app.use("/auth", auth);
app.use(post);
app.use(comment)
app.use(user)
app.listen(port, () => {
  console.log(`Connected to port ${port}`);
});
