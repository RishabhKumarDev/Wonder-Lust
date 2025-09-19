import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import passport from "passport";
import { saveRedirectUrl } from "../middleware.js";
import {
  renderSignupForm,
  signupUser,
  renderLoginForm,
  loginUser,
  logoutUser,
} from "../controllers/user.js";
export const router = express.Router();

router.route("/signup").get(renderSignupForm).post(wrapAsync(signupUser));

router
  .route("/login")
  .get(renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    wrapAsync(loginUser)
  );

router.get("/logout", logoutUser);

export default router;
