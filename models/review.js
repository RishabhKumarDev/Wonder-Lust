import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 150,
    },
    rating: {
      type: Number,
      required: true,
      default: 3,
      min: 1,
      max: 5,
      enum: [1, 2, 3, 4, 5],
    },
    author:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    }
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
export {Review}