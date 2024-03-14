import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as cartSchema from "../cart/cart.schema.js"
import * as cartController from "../cart/cart.controller.js"

const router = Router()

//add to cart
router.post("/",isAuthenticated, isAuthorized("user"),validation(cartSchema.addToCart),cartController.addToCart)
//get all cart
router.get("",isAuthenticated,isAuthorized("user" , "admin"),validation(cartSchema.userCart) ,cartController.userCart)

// update cart
router.patch("/" ,isAuthenticated , isAuthorized("user"), validation(cartSchema.updateCart),  cartController.updateCart)

//remove cart
router.patch("/:productId" , isAuthenticated,isAuthorized("user"), validation(cartSchema.removeFromCart), cartController.removeFromCart )

// clear cart

router.put("/clear",isAuthenticated,isAuthorized("user") , cartController.clearCart)


export default router; 