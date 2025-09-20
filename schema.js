import Joi from "joi";

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.object({
      filename: Joi.string().allow(""),
      url: Joi.string().allow(""),
    }),
    price: Joi.number().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
  }).required(),
});

const reviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().min(1).max(150).required(),
    rating: Joi.number().default(3).min(1).max(5).valid(1, 2, 3, 4, 5),
  }).required(),
});

export { listingSchema, reviewSchema };
