import { Router } from "express";
import * as brandSchema from "./brand.schema.js";
import * as brandController from "./brand.controller.js";
import { validation } from "../../middleware/validation.middleware.js";
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { fileUpload } from "../../../utils/fileUpload.js";
const router = Router();


router.post(
  "/",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().single("brands"),
  validation(brandSchema.createBrand),
  brandController.createBrand
);
//update brand
router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().single("brands"),
  validation(brandSchema.updateBrand),
  brandController.updateBrand
);
//delete
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  validation(brandSchema.deleteBrand),
  brandController.deleteBrand
);
router.get("/",brandController.getAllBrand);




export default router;