import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { ExpressError } from "../utils/ExpressError.js";
import { User } from "../models/user.js";
import passport from "passport";
import { saveRedirectUrl } from "../middleware.js";

const router = express.Router();

router.get("/signup", (req, res) => {
  res.render("users/signup");
});

router.post("/signup", wrapAsync(async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newuser = new User({ username, email });

    const registeredUser = await User.register(newuser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "User Created Successfully!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e?.message);
    res.redirect("/signup");
  }
}));

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  wrapAsync(async (req, res) => {
    const redirectTo = res.locals.redirectUrl || "/listings";
    console.log(redirectTo);
    req.flash("success", "Yoohoo You are Logged In!!!");
    res.redirect(redirectTo);
  })
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are Loged Out Successfully");
    res.redirect("/listings");
  });
});
export default router;
