import { Schema, Types, model } from "mongoose";

const cartSchema = new Schema(
  {
    products: [
      {
        productId: { type: Types.ObjectId, ref: "Product", required: true },
        quantity: { type:Number, required: true , default:1},
      },
    ],
    user: { type: Types.ObjectId, ref: "User", required: true, unique: true }, //this will be the id of the user who owns this item in the cart
  },
  { timestamps: true }
);

export const Cart = model("Cart", cartSchema);