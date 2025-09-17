export const isLogedIn = (req, res, next) => {
  if (!req.isAuthenticated() && req.path !== "/login") {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You need to Login to create listings!");
    return res.redirect("/login");
  }
  next();
};

export const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
