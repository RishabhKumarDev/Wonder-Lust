import express from "express";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import { ExpressError } from "./utils/ExpressError.js";
import listingRouter from "./routes/listings.js";
import reviewRouter from "./routes/reviews.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

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

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter)

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
