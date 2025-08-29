import express from "express";
import mongoose from "mongoose";
import Listing from "./models/listing.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import methodOverride from "method-override";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

(async () => {
  try {
    const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
    await mongoose.connect(MONGO_URL);
    console.log("connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
})();

//routes
app.get("/", (req, res) => {
  res.send("i am root");
});
//data insertion test--
// app.get("/testListing", async (req, res) => {
//   try {
//     let listing1 = {
//       title:
//         "Private swmming pool at the beachfront villa of The Anam resort Cam Ranh",
//       description:
//         " a very nice villa with 8 bedrooms, 8 bathrooms, open kitchen, pool, garden, mountain view.",
//       image:{
//         filename:"villa",
//         url:
//         "https://images.unsplash.com/photo-1596178067639-5c6e68aea6dc?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//       },
//       price: 31000,
//       location:
//         "The Anam, Nguyễn Tất Thành, Cam Hải Đông, Cam Lâm, Khánh Hòa, Việt Nam",
//       country: "Thailand",
//     };

//     let listing = await new Listing(listing1).save();
//     console.log(listing);
//     res.send("saved Successfully");
//   } catch (error) {
//     console.log(error);
//   }
// });

// listing page
app.get("/listings", async (req, res) => {
  try {
    const allListings = await Listing.find();
    res.render("listings/index", { allListings });
  } catch (error) {
    console.log(error);
  }
});
// new listing
app.get("/listings/new", (req, res) => {
  res.render("listings/new");
});
// show
app.get("/listings/:id", async (req, res) => {
  try {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show", { listing });
  } catch (error) {
    console.log(error);
  }
});
//create route
app.post("/listings", async (req, res) => {
  try {
    let listing = await new Listing(req.body.listing).save();
    res.redirect("/listings");
  } catch (error) {
    console.log(error);
  }
});

// edit route
app.get("/listings/:id/edit", async (req, res) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
  } catch (error) {
    console.log(error);
  }
});

// put in DB
app.patch("/listings/:id", async (req, res) => {
  try {
    let { id } = req.params;
    console.log(req.body);
    let updatedListing = await Listing.findByIdAndUpdate(id, req.body.listing, {
      runValidators: true,
      new: true,
    });
    res.redirect(`/listings/${id}`);
  } catch (error) {
    console.log(error);
  }
});
// delete route
app.delete("/listings/:id", async (req, res) => {
  try {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    res.redirect("/listings");
  } catch (error) {
    console.log(error);
  }
});

app.listen("8080", () => {
  console.log("app is listening--- Express ");
});
