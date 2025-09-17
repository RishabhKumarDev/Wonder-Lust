import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { listingSchema } from "../schema.js";
import Listing from "../models/listing.js";
import { ExpressError } from "../utils/ExpressError.js";
import { isLogedIn } from "../middleware.js";

const router = express.Router();

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

// listing page
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index", { allListings });
  })
);
// new listing
router.get("/new", isLogedIn, (req, res) => {
  res.render("listings/new");
});
// show
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    console.log(listing);
    if (!listing) {
      req.flash("error", "Listing Doesn't Exist!");
      return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
  })
);
//create route
router.post(
  "/",
  isLogedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    let listing = await new Listing(req.body.listing).save();
    req.flash("success", "New Listing Created!!!");
    res.redirect("/listings");
  })
);

// edit route
router.get(
  "/:id/edit",
  isLogedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing Doesn't Exist!");
      return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/edit", { listing });
  })
);

// put in DB
router.patch(
  "/:id",
  isLogedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, {
      runValidators: true,
      new: true,
    });
    if (!updatedListing) {
      req.flash("error", "Listing Doesn't Exist!");
      return res.redirect("/listings");
    }
    req.flash("success", "Listing Updated!!!");
    res.redirect(`/listings/${id}`);
  })
);
// delete route
router.delete(
  "/:id",
  isLogedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", "Listing Deleted!!!");
    res.redirect("/listings");
  })
); 

export default router;
