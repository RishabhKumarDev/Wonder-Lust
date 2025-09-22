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
  geometry: {
    type: {
      type: String, // Don't do `{ geometry: { type: String } }-- reason is cuz the field name is also type;`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
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
