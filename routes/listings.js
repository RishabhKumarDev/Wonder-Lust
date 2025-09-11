import express from 'express';
import wrapAsync from "../utils/wrapAsync.js";
import { listingSchema} from "../schema.js";
import Listing from "../models/listing.js";
import { ExpressError } from "../utils/ExpressError.js";

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
router.get("/new", (req, res) => {
  res.render("listings/new");
});
// show
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show", { listing });
  })
);
//create route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let listing = await new Listing(req.body.listing).save();
    res.redirect("/listings");
  })
);

// edit route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
  })
);

// put in DB
router.patch(
  "/:id",
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
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    res.redirect("/listings");
  })
);


export default router;