import { Router } from "express";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as reviewSchema from "./review.schema.js"
import * as reviewController from "./review.controller.js"

const router = Router({mergeParams:true});


// add review

router.post("/:productId" , isAuthenticated, isAuthorized("user") , validation(reviewSchema.createReview) , reviewController.createReview)


// update review

router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized("user"),
  validation(reviewSchema.updateReview),
  reviewController.updateReview
);

export default router;
