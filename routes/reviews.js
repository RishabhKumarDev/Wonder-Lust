import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import Listing from "../models/listing.js";
import { Review } from "../models/review.js";
import { validateReview, isLogedIn, isReviewAuthor } from "../middleware.js";
import { createReview, destoryReview } from "../controllers/reviews.js";

const router = express.Router({ mergeParams: true });

// Reviews...
// Post review
router.post("/", isLogedIn, validateReview, wrapAsync(createReview));

//Delete review

router.delete(
  "/:reviewId",
  isLogedIn,
  isReviewAuthor,
  wrapAsync(destoryReview)
);

export default router;
