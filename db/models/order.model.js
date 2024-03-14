import { Schema, Types, model } from "mongoose";

const orderSchema = new Schema({
    user: { type: Types.ObjectId, ref: "User", required: true },
    products: [{
        productId: { type: Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
        name: String,
        itemPrice: Number,
        totalPrice: Number
        
    }],
    address: { type: String, required: true },
    payment: {type:String , default:"cash" , enum:["cash" , "visa"]},
    phone: {type: String, required: true},
    price: { type: Number, required: true},
    invoice:{url:String , id:String},
    coupon: {
        id: { type: Types.ObjectId, ref: 'Coupon' },
        discount: { type: Number, min: 1, max:100}
    },
    status: { type: String , default:"placed" , enum :["placed" , "shipping" , 'delivered' , "canceled" , "refunded"]},
}, { timestamps: true });
orderSchema.virtual("finalePrice").get(function () {
    return this.coupon ?
        Number.parseFloat(
            this.price - (this.price * this.coupon.discount || 0) / 100
        ).toFixed(2) : this.price;
 })

export const Order = model("Order", orderSchema);