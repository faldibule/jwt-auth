const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const AuthController = {
  loginPage: (req, res) => {
    res.locals.cekNav = null;
    res.locals.loginError = null;
    res.locals.regisSuccess = null;
    res.render("authPage", {
      title: "Halaman Auth",
      layout: "layouts/auth",
      old: {},
    });
  },

  login: async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        res.locals.loginError = "Email Belum Terdaftar";
        res.locals.regisSuccess = null;
        res.locals.cekNav = null;
        return res.render("authPage", {
          title: "Halaman Auth",
          layout: "layouts/auth",
          old: {},
        });
      }

      const cekPassword = await bcrypt.compare(req.body.password, user.password);
      if (!cekPassword) {
        res.locals.loginError = "Password Salah";
        res.locals.regisSuccess = null;
        res.locals.cekNav = null;
        return res.render("authPage", {
          title: "Halaman Auth",
          layout: "layouts/auth",
          old: {},
        });
      }

      //kirim jwt
      const token = jwt.sign({ _id: user._id }, "aokwodjaowjdoajwdoajwodjao");
      res.cookie("userToken", token, { httpOnly: true, maxAge: 1000000 });
      res.redirect("/");
    } catch (error) {
      console.log(error);
    }
  },

  register: async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      res.locals.loginError = null;
      res.locals.regisSuccess = null
      res.locals.cekNav = null;
      res.render("authPage", {
        title: "Halaman Auth",
        layout: "layouts/auth",
        errors: errors.array(),
        old: req.body
      });
    }else{
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const image = 'https://res.cloudinary.com/bdonglot/image/upload/v1629872092/wbmznxyuvdfhph2gkmkn.jpg'
        const image_id = 'wbmznxyuvdfhph2gkmkn'
        const userData = {
          nama: req.body.nama,
          email: req.body.email,
          password: hashedPassword,
          image,
          image_id,
          posts: undefined,
          comments: undefined,
        };
        const isSuccess = await User.insertMany(userData);
        if(isSuccess){
          res.locals.loginError = null;
          res.locals.regisSuccess = 'Berhasil Registrasi, Silahkan Login disini!';
          res.locals.cekNav = null;
          res.render("authPage", {
            title: "Halaman Auth",
            layout: "layouts/auth",
            old: {},
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  },

  logout: async (req, res) => {
    // await res.cookie("userToken", "", { maxAge: 1 });
    await res.clearCookie('userToken');
    // res.setHeader('userToken', 'mycookie=; max-age=0');
    res.redirect("/auth/login");
  },
};

module.exports = AuthController;
