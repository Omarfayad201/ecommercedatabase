
import { Brand } from "../../../db/models/brand.model.js";
import { Category } from "../../../db/models/category.model.js";
import { Subcategory } from "../../../db/models/subcategory.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import cloudinary from "../../../utils/cloud.js";
import { Product } from "../../../db/models/product.model.js";
import { nanoid } from "nanoid"

export const createProduct = asyncHandler(async (req, res, next) => {
  // check category
  const category = await Category.findById(req.body.category)
  if (!category) return next(new Error("category not found", { cause: 404 }))
  //check subCategory
  const subcategory = await Subcategory.findById(req.body.subcategory);
  if (!subcategory) return next(new Error("subcategory not found", { cause: 404 }));
  //check brand
  const brand = await Brand.findById(req.body.brand)
  if (!brand) return next(new Error("brand not found", { cause: 404 }));
  // check file
  if (!req.files) return next(new Error("products images is required", { cause: 400 }))
  // create folder name 
  const cloudFolder = nanoid()
  let images = [];
  //upload sub images
  for (const file of req.files.subImages) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}` });
    images.push({ id: public_id, url: secure_url })
  }
  //default image
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.defaultImage[0].path,
    { folder: `${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}` }
  );
  //create product
  const product = await Product.create({
    ...req.body,
    cloudFolder,
    createdBy: req.user._id,
    defaultImage: { url: secure_url, id: public_id },
    images,
  });
  //send response
  return res.json({ success: true, message: "products successFully created!" })
});

export const deleteProduct = asyncHandler(async (req, res, next) => {
  // check product
  const product = await Product.findById(req.params.id);
  if (!product) return next(new Error("product not found", { cause: 404 }));
  // check owner
  if (req.user._id.toString() !== product.createdBy.toString())
    return next(new Error("Not Authorized", { cause: 401 }));
  // delete products
  await product.deleteOne();
  // delete image
  const ids = product.images.map((image) => image.id);
  ids.push(product.defaultImage.id);
  await cloudinary.api.delete_resources(ids);
  // delete folder
  await cloudinary.api.delete_folder(
    `${process.env.CLOUD_FOLDER_NAME}/products/${product.cloudFolder}`
  );
  //return response
  return res.json({ success: true, message: "products deleted successfully!" });
});

export const allProducts = asyncHandler(async (req, res, next) => {
  let { category, brand, subcategory ,description , sort, page, keyword } = req.query;
  
  if (category && !(await Category.findById(category))) return next( new Error('Invalid Category', { cause: 404 }))
  if (subcategory && !(await Subcategory.findById(subcategory))) return next(new Error('Invalid subcategory', { cause: 404 })) 
  if (brand && !(await Brand.findById(brand))) return next(new Error('Invalid brand', { cause: 404 })) 
 
  const result = await Product.find({ ...req.query }).sort(sort).paginate(page).search(keyword)

  return res.json({ success: true, result })
});
// let query = Product.find().sort([["createdAt", -1]]).select(["-__v"]);
//   if (price) query = query.where("price").lte(Number(price))
//   if (availableItems && Number(availableItems) > 0)
//     query = query.where("itemCount").gte(Number(availableItems))
//   if (discount) query = query.where("discount").lte(Number(discount))
//   const pageSize = +req.query.pageSize || 6;
  