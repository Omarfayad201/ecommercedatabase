import slugify from "slugify";
import { Brand } from "../../../db/models/brand.model.js";
import { Category } from "../../../db/models/category.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import cloudinary from "../../../utils/cloud.js";

export const createBrand = asyncHandler(async (req, res, next) => {
    // check categories
    const { categories, name } = req.body
    
    categories.forEach(async (categoryId) => {
        const category = await Category.findById(categoryId)
        if (!category) return next(new Error(`category ${categoryId} not found!`, { cause: 404 }))
    });
    if (!req.file) return next(new Error("file image is required!", { cause: 404 }));
   
    // upload image in cloudinary

    const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.file.path,
        { folder: `${process.env.CLOUD_FOLDER_NAME}/brands` }
    );
    //save brand

    const brand = await Brand.create({
        name,
        createdBy: req.user._d,
        slug: slugify(name),
        image: { url: secure_url, id: public_id },
    });
    //save brand in category

    categories.forEach(async (categoryId) => {
        const category = await Category.findById(categoryId);
        category.brands.push(brand._id);
        await category.save()
    });
    //return
    return res.json({ success: true, message: "brand created successfully!" })
});

export const updateBrand = asyncHandler(async (req, res, next) => {
    // get id brand
    // const { id } = req.params.id;

    //check id found in brand model
    let brand = await Brand.findById(req.params.id);
    if (!brand) return next(new Error("brand nor found", { cause: 404 }));
    // check file upload
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
            { public_id: brand.image.id }
        )
        brand.image = { url: secure_url, id: public_id }
    }
    //update brand name
    brand.name = req.body.name ? req.body.name : brand.name
    brand.slug = req.body.name ? slugify(req.body.name) : brand.slug;
    // save data in brand 
    await brand.save();
    //return response
    return res.json({ success: true, message: "brand updated successfully!" });
});


export const deleteBrand = asyncHandler(async (req, res, next) => {
    // get id
    
    //check brand id 
    const brand = await Brand.findById(req.params.id);
    if (!brand) return next(new Error("brand not found", { cause: 404 }));
    //check admin
    // if (req.user._id.toString() !== brand.createdBy.toString())
    //   return next(new Error("you not allowed to delete"), { cause: 401 });
    //deleted     
    await brand.deleteOne();
    await cloudinary.uploader.destroy(brand.image.id);
    await Category.updateMany({}, { brands: brand._id })
    // await brand.save()
    return res.json({ success: true, message: "brand deleted successfully" })
});


export const getAllBrand = asyncHandler(async (req, res, next) => {
    
    const result = await Brand.find()
    return res.json({success:true ,result })
})

