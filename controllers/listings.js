import Listing from "../models/listing.js";

const index = async (req, res) => {
  const allListings = await Listing.find();
  res.render("listings/index", { allListings });
};

const renderNewForm = (req, res) => {
  res.render("listings/new");
};

const showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");
  // console.log(listing,"----------------");
  if (!listing) {
    req.flash("error", "Listing Doesn't Exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show", { listing });
};

const createListing = async (req, res, next) => {
  let listing = new Listing(req.body.listing);
  listing.owner = req.user._id;
  await listing.save();
  req.flash("success", "New Listing Created!!!");
  res.redirect("/listings");
};

const renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing Doesn't Exist!");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/edit", { listing });
};

const updateListing = async (req, res) => {
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
};

const deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!!!");
  res.redirect("/listings");
};

export {
  index,
  renderNewForm,
  showListing,
  createListing,
  renderEditForm,
  updateListing,
  deleteListing,
};
