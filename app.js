import "dotenv/config";
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
import MongoStore from "connect-mongo";


const db_URL = process.env.ATLAS_URL;

(async () => {
  try {
    await mongoose.connect(db_URL);
    console.log("connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
})();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const store = MongoStore.create({
  mongoUrl: db_URL,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 3600,
});
store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE");
});
const sessionOptions = {
  store,
  secret: process.env.SESSION_SECRET,
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

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/",(req,res)=>{
  res.redirect("/listings");
})
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// page not found
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(400, "Page Not Found"));
});

// error middleware;
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "some thing went wrong" } = err;
  res.status(statusCode).render("listings/error", { message });
});

app.listen("8080", () => {
  console.log("app is listening--- Express", `http://localhost:8080/listings`);
});
