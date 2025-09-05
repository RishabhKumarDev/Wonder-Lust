import Joi from 'joi';

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description:Joi.string().required(),
        image:Joi.object({
            filename:Joi.string(),
            url:Joi.string()
        }),
        price: Joi.number().required(),
        location:Joi.string().required(),
        country:Joi.string().required(),
    }).required()
})

export default listingSchema;