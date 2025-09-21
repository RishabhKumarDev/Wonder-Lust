import express from "express";
import wrapAsync from "../utils/wrapAsync.js";
import { isLogedIn, isOwner, validateListing } from "../middleware.js";
import {
  index,
  renderNewForm,
  showListing,
  createListing,
  renderEditForm,
  updateListing,
  deleteListing,
} from "../controllers/listings.js";
import { cloudinary, storage } from "../cloudConfig.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: storage });

router
  .route("/")
  .get(wrapAsync(index))
  .post(
    isLogedIn,
    upload.single("listing[image][url]"),
    validateListing,
    wrapAsync(createListing)
  );

router.get("/new", isLogedIn, renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(showListing))
  .patch(
    isLogedIn,
    isOwner,
    upload.single("listing[image][url]"),
    validateListing,
    wrapAsync(updateListing)
  );

// edit route
router.get("/:id/edit", isLogedIn, isOwner, wrapAsync(renderEditForm));

// delete route
router.delete("/:id", isLogedIn, isOwner, wrapAsync(deleteListing));

export default router;
