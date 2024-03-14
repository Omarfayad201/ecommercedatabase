import { Order } from "../../../db/models/order.model.js";
import { Product } from "../../../db/models/product.model.js";
import { Review } from "../../../db/models/review.model.js";
import { asyncHandler } from "../../../utils/asyncHandler.js";

export const createReview = asyncHandler(async (req, res, next) => {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!productId || !rating || !comment) return res.status(400).json({ error: "Missing fields" });
    
    // check product order
    const order = await Order.findOne({
        user: req.user._id,
        status: "delivered",
        "products.productId": productId
    })
    if (!order) return next(new Error("Can not review this product!", { cause: 400 }))
    
    // check past reviews
    if (await Review.findOne({ createdBy: req.user._id, productId })) return next(new Error("Already reviewed by you!"))
    
    const review = await Review.create({ comment, rating, createdBy: req.user._id, productId, orderId: order._id })
    
    // calculate average review

    let calcRating = 0;
    const product = await Product.findById(productId);
    const reviews = await Review.find({ productId });
    for (let i = 0; i < reviews.length; i++) {
        calcRating += reviews[i].rating;
    }
    product.averageRate = calcRating / reviews.length;
    await product.save();

    return res.json({ success: true, result: { review } })
});

export const updateReview = asyncHandler(async (req, res, next) => {
  // data
  const { id , productId } = req.params;
    await Review.updateOne({ _id: id, productId }, { ...req.body })
    if (req.body.rating) {
        let calcRating = 0;
        const product = await Product.findById(productId);
        const reviews = await Review.find({ productId });
        for (let i = 0; i < reviews.length; i++) {
          calcRating += reviews[i].rating;
        }
        product.averageRate = calcRating / reviews.length;
        await product.save();
    }
    return res.json({success:true , message:"review updated successfully!"})
});