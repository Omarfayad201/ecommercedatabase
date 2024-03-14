import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";

export const createCoupon = Joi.object({
    discount : Joi.number().integer().min(1).max(100).options({convert:false}).required(),
    expiredAt: Joi.date().greater(Date.now()).required(),
}).required()


export const updateCoupon = Joi.object(
    {
        discount: Joi.number().integer().min(1).max(100).options({ convert: false }),
        expiredAt: Joi.date().greater(Date.now()),
        code: Joi.string().length(5).required()
    }
).required()

export const deleteCoupon = Joi.object(
    {
        id:Joi.string().custom(isValidObjectId).required(),
    }
).required()