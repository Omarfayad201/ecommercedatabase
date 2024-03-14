import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";

export const createOrder = Joi.object({
  // products: Joi.array().required(),
  address: Joi.string().required(),
  phone: Joi.string().required(),
  payment: Joi.string().valid("cash", "visa"),
  coupon: Joi.string().required().length(5),
}).required();

export const cancelOrder = Joi.object({
    id:Joi.string().custom(isValidObjectId).required()
}).required()