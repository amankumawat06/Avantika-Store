import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      minlength: 5,
      required: true,
      select: false,
    },
    image: {
      type: String,
      default: "default.png",
    },
    imageId: {
      type: String,
      default: "default_img_public_id",
    },
  },
  { timeStamps: true },
);

export const User = mongoose.model("User", UserSchema);
