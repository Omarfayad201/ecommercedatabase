import { Types } from "mongoose";
import { Product } from "../../db/models/product.model.js";

export const isValidObjectId = (value, helper) => {
    if (Types.ObjectId.isValid(value)) return true
    return helper.message("invalid objectId!");
};

export const validation = (schema) => {
    return (req, res, next) => {
        const data = { ...req.body, ...req.params, ...req.query };

        const validationResult = schema.validate(data, { abortEarly: false });

        if (validationResult.error) {
            const errorMessage = validationResult.error.details.map(
                (errorObj) => errorObj.message)
            return next(new Error(errorMessage, { cause: 400 }));
        };
        return next();
    };
};
