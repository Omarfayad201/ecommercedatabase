import { Schema, Types, model } from "mongoose";

export const brandSchema = new Schema({
    name: { type: String, unique: true, required: true, min: 2, max: 20 },
    slug: { type: String, required: true, unique: true },
    image: { url: { type: String, required: true }, id: { type: String, required: true } },
    createdBy:{type: Types.ObjectId , ref:"User"}
}, { timestamps: true })

export const Brand = model("Brand", brandSchema)