import { Schema, Types, model } from "mongoose";

const productSchema = new Schema({
    name: { type: String, required: true, min: 2, max: 20 },
    description: { type: String, required: true, min: 10, max: 200 },
    images: [{
        id: { type: String, required: true },
        url: { type: String, required: true }
    }],
    defaultImage: {
        id: { type: String, required: true },
        url: { type: String, required: true }
    },
    availableItems: { type: Number, min: 1, required: true },
    soldItems: { type: Number, default: 0 },
    price: { type: Number, min: 1, required: true },
    discount: { type: Number, min: 1, max: 100 },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    category: { type: Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: Types.ObjectId, ref: "SubCategory", required: true },
    brand: { type: Types.ObjectId, ref: "Brand", required: true },
    cloudFolder: { type: String, unique: true, required: true },
    averageRate:{type:Number , min:1 , max:5}
    
}, { timestamps: true,strictQuery:true ,toJSON: { virtuals: true }, toObject: { virtuals: true } });

productSchema.virtual("finalPrice").get(function () {
    return Number.parseFloat(this.price - (this.price * this.discount || 0) / 100).toFixed(2)
});

productSchema.virtual("review", {
    ref: "Review",
    localField: "_id",
    foreignField: "productId"
});
////////
productSchema.query.paginate = function (page) {
    //this >>> query
  page = page<1 || isNaN(page) || !page? 1 : page
  const limit = 2
    const skip = limit * (page - 1);
    return this.skip(skip).limit(limit)
}

productSchema.query.search = function (keyword) {
    if (!keyword || keyword === "") {
    return this.find()
    } else {
        return this.find({$or:[{name:{$regex:keyword , $options:"i"}},{description:{$regex:keyword , $options:"i"}}]})
}
}

productSchema.methods.inStock = function (requiredQuantity) {
    return this.availableItems >= requiredQuantity? true : false;
}
export const Product = model("Product", productSchema);