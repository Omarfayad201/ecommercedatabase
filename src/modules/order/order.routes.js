import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as orderSchema from "../order/order.schema.js"
import * as orderController from "../order/order.controller.js"

const router = Router();
// create order

router.post("/",isAuthenticated,isAuthorized("user"),validation(orderSchema.createOrder),orderController.createOrder)

router.patch("/:id",isAuthenticated,isAuthorized("user"),validation(orderSchema.cancelOrder),orderController.cancelOrder)

// cancel order

export default router;
