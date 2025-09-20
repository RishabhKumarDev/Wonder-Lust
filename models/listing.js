import mongoose from "mongoose";
import { Review } from "./review.js";

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: 165,
    required: true,
  },
  description: {
    type: String,
    maxlength: 265,
    required: true,
  },
  image: {
    filename: {
      type: String,
    },
    url: {
      type: String,
    },
  },
  price: {
    type: Number,
    requierd: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing, next) => {
  if (listing) {
    let deletedReviews = await Review.deleteMany({
      _id: { $in: listing.reviews },
    });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
