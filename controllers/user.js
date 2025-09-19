import { User } from "../models/user.js";

const renderSignupForm = (req, res) => {
  res.render("users/signup");
};

const signupUser = async (req, res) => {
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
};

const renderLoginForm = (req, res) => {
  res.render("users/login");
};

const loginUser = async (req, res) => {
  const redirectTo = res.locals.redirectUrl || "/listings";
  console.log(redirectTo);
  req.flash("success", "Yoohoo You are Logged In!!!");
  res.redirect(redirectTo);
};

const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are Loged Out Successfully");
    res.redirect("/listings");
  });
};

export { renderSignupForm, signupUser, renderLoginForm, loginUser, logoutUser };
