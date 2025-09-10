import express from "express";
import mongoose from "mongoose";
import Listing from "./models/listing.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import wrapAsync from "./utils/wrapAsync.js";
import { ExpressError } from "./utils/ExpressError.js";
import { listingSchema, reviewSchema } from "./schema.js";
import { Review } from "./models/review.js";

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

// Validate Logic
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errMsz = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsz);
  } else {
    next();
  }
};
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

//data insertion test--
// app.get("/testListing", async (req, res) => {
//   try {
//     let listing1 = {
//       title:
//         "Private swmming pool at the beachfront villa of The Anam resort Cam Ranh",
//       description:
//         " a very nice villa with 8 bedrooms, 8 bathrooms, open kitchen, pool, garden, mountain view.",
//       image:{
//         filename:"villa",
//         url:
//         "https://images.unsplash.com/photo-1596178067639-5c6e68aea6dc?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       },
//       price: 31000,
//       location:
//         "The Anam, Nguyễn Tất Thành, Cam Hải Đông, Cam Lâm, Khánh Hòa, Việt Nam",
//       country: "Thailand",
//     };

//     let listing = await new Listing(listing1).save();
//     console.log(listing);
//     res.send("saved Successfully");
//   } catch (error) {
//     console.log(error);
//   }
// });

// listing page
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index", { allListings });
  })
);
// new listing
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});
// show
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show", { listing });
  })
);
//create route
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let listing = await new Listing(req.body.listing).save();
    res.redirect("/listings");
  })
);

// edit route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
  })
);

// put in DB
app.patch(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, {
      runValidators: true,
      new: true,
    });
    res.redirect(`/listings/${id}`);
  })
);
// delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    res.redirect("/listings");
  })
);

// Reviews...
// Post review
app.post(
  "/listings/:id/review",
  validateReview,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);

    let data = req.body.review;
    let review = new Review(data);

    listing.reviews.push(review);

    review.save();
    listing.save();
    res.redirect(`/listings/${listing._id}`);
  })
);

//Delete review

app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    let deletedReview = await Review.findByIdAndDelete(reviewId);

    let removedId = await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    },{new:true});
    console.log(removedId, deletedReview);
    res.redirect(`/listings/${id}`);
  })
);

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
