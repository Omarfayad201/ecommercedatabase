import slugify from "slugify";
import { Category } from "../../../db/models/category.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import cloudinary from "../../../utils/cloud.js";
import  {Subcategory}  from "../../../db/models/subcategory.model.js";


export const createSubcategory = asyncHandler(async (req, res, next) => {
    //check category
    const category = await Category.findById(req.params.category);
    if (!category) return next(new Error("category not found",{cause:404}))
  //check file
  if (!req.file)
    return next(new Error("subcategory image is required!", { cause: 400 }));

  // upload image in cloudinary
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.CLOUD_FOLDER_NAME}/subcategory`,
    }
  );
  // save subcategory in data base
  await Subcategory.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    createdBy: req.user._id,
      image: { id: public_id, url: secure_url },
    category: req.params.category,
  });
  // return response
  return res.json({
    success: true,
    message: "subcategory is created successfully!",
  });
});



export const updateSubcategory = asyncHandler(async (req, res, next) => {
  // check category
  const category = await Category.findById(req.params.category);
  if (!category) return next(new Error("category not found", { cause: 404 }));
    //check subcategory
    const subcategory = await Subcategory.findOne({_id:req.params.id , category:req.params.category})
  // check category owner
  if (req.user._id.toString() !== subcategory.createdBy.toString())
    return next(new Error("not allowed to update the subcategory"));
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { public_id: subcategory.image.id }
    );
    subcategory.image = { id: public_id, url: secure_url };
  }
  //update subcategory
  subcategory.name = req.body.name ? req.body.name : subcategory.name;
  subcategory.slug = req.body.name ? slugify(req.body.name) : subcategory.slug;

  await subcategory.save();
  //return response

  return res.json({ success: true, message: "subcategory updated successfully" });
});


export const deleteSubcategory = asyncHandler(async (req, res, next) => {
  //check category and deleted
  // check category
  const category = await Category.findById(req.params.category);
  if (!category) return next(new Error("category not found", { cause: 404 }));
  //check subcategory
  const subcategory = await Subcategory.findOne({
    _id: req.params.id,
    category: req.params.category,
  });
  // check category owner
  if (req.user._id.toString() !== subcategory.createdBy.toString())
    return next(new Error("not allowed to update the subcategory"));
  //delete category
  await Subcategory.findByIdAndDelete(req.params.id);
  //delete image category from cloudinary
  await cloudinary.uploader.destroy(subcategory.image.id);
  //return response
  return res.json({ success: true, message: "subcategory deleted successfully!" });
});


export const allSubcategories = asyncHandler(async (req, res, next) => {

    if (req.params.category) {
        const category = await Category.findById(req.params.category);
        if (!category)
          return next(
            new Error("category not found can get subcategory!", { cause: 404 })
          );
        const result = await Subcategory.find({ category: req.params.category })
        return res.json({success:true , result})
}

    // let result = awaitSubcategory.find().populate([{
    //     path: "category", select: "name"
    // }, { path: "createdBy" }]);//<=multiple populate
    let result = await Subcategory.find().populate([{path:"createdBy"},{
        path: "category", select: "name", populate: [{ path: "createdBy", select: "email" }]
    }]);

    return res.json({ success: true, result });
})
