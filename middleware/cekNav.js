const cekNav = (req, res, next) => {
  res.locals.nav = res.locals.user ? true : false;
  return next();
};

module.exports = cekNav;
