import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import Listing from "../models/listing.js";
import {reviewSchema } from "../schema.js";
import { Review } from "../models/review.js";
import { ExpressError } from "../utils/ExpressError.js";


const router = express.Router({mergeParams:true});

const validateReview = (req, res, next) => {
  let { error,value } = reviewSchema.validate(req.body);

  if (error) {
    let errMsz = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsz);
  } else {
    next();
  }
};
// Reviews...
// Post review
router.post(
  "/",
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

router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    let deletedReview = await Review.findByIdAndDelete(reviewId);

    let removedId = await Listing.findByIdAndUpdate(
      id,
      {
        $pull: { reviews: reviewId },
      },
      { new: true }
    );
    console.log(removedId, deletedReview);
    res.redirect(`/listings/${id}`);
  })
);

export default router;
