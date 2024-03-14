import { Schema, Types, model } from "mongoose";

const tokenSchema = Schema({
    token: { type: String, required: true },
    user: { type: Types.ObjectId, ref: "User" },
    isValid: { type: Boolean, default: true },
    agent: { type: String },
    expiredAt: { type: String },
});

export const Token = model("Token" , tokenSchema)