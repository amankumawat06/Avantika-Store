import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
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
    required: true,
  },
  image: {
    url: {
      type: String,
      required: true,
      default: "default.png",
    },
    imageId: {
      type: String,
      required: true,
    },
    
  },
}, { timeStamps: true });

export const User = model("User", UserSchema);
