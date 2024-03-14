import { Schema, Types, model } from "mongoose";

const reviewSchema = new Schema({
    rating: { type: Number, min: 1, max: 5, required: true  , required:true},
    comment:{type: String},
    productId: { type: Types.ObjectId, ref: "Product" , required:true},
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    orderId: { type:Types.ObjectId , ref:"Order" , required:true},
}, { timestamps:true })


export const Review = model("Review",reviewSchema)