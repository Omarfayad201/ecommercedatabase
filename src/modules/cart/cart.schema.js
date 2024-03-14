import Joi from "joi";
import { isValidObjectId } from "../../middleware/validation.middleware.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import { Cart } from "../../../db/models/cart.model.js";

export const addToCart = Joi.object({
    productId: Joi.string().custom(isValidObjectId).required(),
    quantity: Joi.number().integer().min(1),
}).required();

export const userCart  = Joi.object({
    cartId: Joi.string().custom(isValidObjectId)
});

export const updateCart = Joi.object({
    productId: Joi.string().custom(isValidObjectId).required(),
    quantity:Joi.number().integer().min(1).required()
})

export const removeFromCart = Joi.object({
    productId:Joi.string().custom(isValidObjectId).required(),
});

