import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as couponSchema from "../coupon/coupon.schema.js";
import * as couponController from "../coupon/coupon.controller.js"

const router = Router();

router.post("/", isAuthenticated,isAuthorized("seller"),validation(couponSchema.createCoupon),couponController.createCoupon)

// update

router.patch(
  "/:code",
  isAuthenticated,
  isAuthorized("seller"),
  validation(couponSchema.updateCoupon),
  couponController.updateCoupon
);

//delete
router.delete("/:id",isAuthenticated,isAuthorized("seller"),validation(couponSchema.deleteCoupon),couponController.deleteCoupon)

// all coupon
router.get("/", couponController.allCoupon);

export default router ; 