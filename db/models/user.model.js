import { Schema, model } from "mongoose";
import bcryptjs from "bcryptjs"
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "seller","admin"],
      default: "user",
    },
    forgetCode: String,
    profileImage: {
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dtqkalw6p/image/upload/v1705537198/samples/Ecommerce-application/users/defaults/profilePic/default-placeholder-profile-icon-avatar-gray-man-90197993_bnsmpo.webp",
      },
      id: {
        type: String,
        default:
          "Ecommerce-application/users/defaults/profilePic/default-placeholder-profile-icon-avatar-gray-man-90197993_bnsmpo",
      },
        },
    coverImages:[{url:{type:String} , id:{type:String}}],
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
   this.password = bcryptjs.hashSync(this.password,parseInt(process.env.SALT_ROUND));
}

})
export const User = model("User", userSchema);

