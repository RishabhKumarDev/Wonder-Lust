import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import Listing from "../models/listing.js";
import { isLogedIn, isOwner,validateListing } from "../middleware.js";

const router = express.Router();



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
    const listing = await Listing.findById(id)
      .populate({
        path:"reviews",
        populate:{path:"author"}
      })
      .populate("owner");
    // console.log(listing,"----------------");
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
  // isOwner,
  validateListing,
  wrapAsync(async (req, res, next) => {
    let listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    await listing.save();
    req.flash("success", "New Listing Created!!!");
    res.redirect("/listings");
  })
);

// edit route
router.get(
  "/:id/edit",
  isLogedIn,
  isOwner,
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

// Update
router.patch(
  "/:id",
  isLogedIn,
  isOwner,
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
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", "Listing Deleted!!!");
    res.redirect("/listings");
  })
);

export default router;
