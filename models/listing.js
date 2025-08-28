import mongoose from "mongoose";

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
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1755605889798-7b33d0477768?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          : v,
      default:
        "https://images.unsplash.com/photo-1755605889798-7b33d0477768?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
});

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;
