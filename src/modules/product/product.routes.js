import { Router } from "express";
import reviewRouter from "../review/review.routes.js"
import { isAuthenticated } from "../../middleware/authentication.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { fileUpload } from "../../../utils/fileUpload.js";
import { validation } from "../../middleware/validation.middleware.js";
import * as productSchema from "../product/product.schema.js"
import * as productController from "../product/product.controller.js"

const router = Router()

router.use("/:productId/review", reviewRouter);

router.post("/", isAuthenticated, isAuthorized("seller"), fileUpload().fields([
    { name: "defaultImage", maxCount: 1 },
    {name:"subImages" , maxCount:3},
]) , validation(productSchema.createProduct),productController.createProduct)


router.delete("/:id" , isAuthenticated , isAuthorized("seller"), validation(productSchema.deleteProduct), productController.deleteProduct)


router.get("/" , productController.allProducts)


export default router; 
