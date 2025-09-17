import Listing from "./models/listing.js";
import { listingSchema } from "./schema.js";
import { ExpressError } from "./utils/ExpressError.js";
import {reviewSchema } from "./schema.js";


export const isLogedIn = (req, res, next) => {
  if (!req.isAuthenticated() && req.path !== "/login") {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You need to Login to create listings!");
    return res.redirect("/login");
  }
  next();
};

export const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

export const isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  console.log(listing.owner);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not authorized for this!!!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// Validate Logic
export const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

export const validateReview = (req, res, next) => {
  let { error,value } = reviewSchema.validate(req.body);

  if (error) {
    let errMsz = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsz);
  } else {
    next();
  }
};