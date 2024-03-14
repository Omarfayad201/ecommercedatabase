import slugify from "slugify";
import { Category } from "../../../db/models/category.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import cloudinary from "../../../utils/cloud.js";

export const createCategory = asyncHandler(async (req, res, next) => {
  //check file
  if (!req.file) return next(new Error("category image is required!", { cause: 400 }));

  // upload image in cloudinary 
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FOLDER_NAME}/category`,
    }
  );
  // save category in data base
  await Category.create({
    name: req.body.name, slug: slugify(req.body.name), createdBy: req.user._id, image: { id: public_id, url: secure_url }
  });
  // return response
  return res.json({ success: true, message: "category is created successfully!" });
});



export const updateCategory = asyncHandler(async (req, res, next) => {
  // check category
  const category = await Category.findById(req.params.id);
  if (!category) return next(new Error("category not found", { cause: 404 }));

  // check category owner
  if (req.user._id.toString() !== category.createdBy.toString())
    return next(new Error("not allowed to update the category"));
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { public_id: category.image.id }
    
    )
    category.image = { id: public_id, url: secure_url }
  }
  //update category
  category.name = req.body.name ? req.body.name : category.name
  category.slug = req.body.name ? slugify(req.body.name) : category.slug

  await category.save()
  //return response

  return res.json({ success: true, message: "category updated successfully" })
  
});


export const deleteCategory = asyncHandler(async (req, res, next) => {
  //check category and deleted
  const category = await Category.findById(req.params.id);
  if (!category) return next(new Error("category not found", { cause: 404 }));
  //check owner 
  if (category.createdBy.toString() !== req.user._id.toString()) return next(new Error("not allowed to delete!", { cause: 403 }));
  //delete category
  // await Category.findByIdAndDelete(req.params.id);
  await category.deleteOne()
  //delete image category from cloudinary
  await cloudinary.uploader.destroy(category.image.id);
  //return response
  return res.json({ success: true, message: "category deleted successfully!" });

});


export const allCategory = asyncHandler(async (req, res, next) => {
  const results = await Category.find().populate("subcategory");
  console.log(results);
  return res.json({ success: true, results });
});