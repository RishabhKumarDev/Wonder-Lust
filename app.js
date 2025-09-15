import express from "express";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import { ExpressError } from "./utils/ExpressError.js";
import listingRouter from "./routes/listings.js";
import reviewRouter from "./routes/reviews.js";
import userRouter from "./routes/user.js";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import LocalStrategy from "passport-local";
import { User } from "./models/user.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
const sessionOptions = {
  secret: "p9vT6x!fR2#kW8qZ4uL0mS7jD1bH3yN5",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.engine("ejs", ejsMate);

(async () => {
  try {
    const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
    await mongoose.connect(MONGO_URL);
    console.log("connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
})();

//routes
app.get("/", (req, res) => {
  res.send("i am root");
});

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "third@gmail.com",
//     username: "third",
//   });

//   const registeredUser = await User.register(fakeUser, "helloword");
//   res.send(registeredUser)
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);
// page not found
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(400, "Page Not Found"));
});

// error middleware;
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "some thing went wrong" } = err;
  res.status(statusCode).render("listings/error", { message });
  // res.status(statusCode).send(message);
});

app.listen("8080", () => {
  console.log("app is listening--- Express", `http://localhost:8080/listings`);
});
