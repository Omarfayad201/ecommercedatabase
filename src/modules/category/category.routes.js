import { Router } from "express";
import * as categorySchema from "./category.schema.js"
import * as categoryController from "./category.controller.js"
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import { fileUpload } from "../../../utils/fileUpload.js";
import subcategoryRouter from "./../subcategory/subcategory.routes.js"
const router = Router();

// CRUD

router.use("/:category/subcategory" , subcategoryRouter)

// add category
router.post("/", isAuthenticated , isAuthorized("admin") ,fileUpload().single("category"),validation(categorySchema.createCategory),categoryController.createCategory);

//update category

router.patch(
  "/:id",
  isAuthenticated,
  isAuthorized("admin"),
  fileUpload().single("category"),
  validation(categorySchema.updateCategory),
  categoryController.updateCategory
);

//delete category

router.delete("/:id" , isAuthenticated, isAuthorized("admin") , validation(categorySchema.deleteCategory),categoryController.deleteCategory)

// get allCategory

router.get("/",categoryController.allCategory)

export default router;