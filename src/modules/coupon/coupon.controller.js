import { Coupon } from "../../../db/models/coupon.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";
import voucher_codes from "voucher-code-generator"
export const createCoupon = asyncHandler(async (req, res, next) => {
    // generate name
    const code = voucher_codes.generate({ length: 5 });
    // create coupon model 
    const coupon = await Coupon.create({
        name: code[0],
        createdBy: req.user._id,
        discount: req.body.discount,
        expiredAt: new Date(req.body.expiredAt).getTime(),
    });
    //return response
    return res.status(201).json({ success: true, result: { coupon } })
});

export const updateCoupon = asyncHandler(async (req, res, next) => {
    // check coupon
    const coupon = await Coupon.findOne({ name: req.params.code, expiredAt: { $gt: Date.now() } });
    if (!coupon) return next(new Error("coupon not found or expired!", { cause: 404 }));
    
    //check owner
    if (req.user._id.toString() != coupon.createdBy.toString()) return next(new Error("not Authorized", { cause: 401 }));


    // update coupon

    coupon.discount = req.body.discount ? req.body.discount : coupon.discount; 
    coupon.expiredAt = req.body.expiredAt ? new Date(req.body.expiredAt).getTime() : coupon.expiredAt;

    await coupon.save();

    return res.json({success:true , message:"coupon updated successfully!"})
});


export const deleteCoupon = asyncHandler(async (req, res, next) => {
    // check coupon
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return next(new Error("coupon not found", { cause: 404 }));
    //check owner
    if (req.user._id.toString() != coupon.createdBy.toString()) return next(new Error("you are not authorized to delete!"))

    // deleted coupon
    await coupon.deleteOne();

    // await coupon.save()

    return res.json({ success: true, message: "coupon deleted successfully!" })
});


export const allCoupon = asyncHandler(async (req, res, next) => {
    // check owner

    // if (req.user._id.toString() != coupon.createdBy.toString())
    //     return next(new Error("you are not authorized to delete!"));
    
    // get coupon

    const allCoupon = await Coupon.find();

    return res.json({success:true , allCoupon})
})

