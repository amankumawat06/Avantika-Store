import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  slug: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  desc: {
    type: String,
    trim: true,
    default: "",
  },
  price: {
    type: Number,
    min: 1,
    required: true,
  },
  features: {
    type: [String],
    required: true,
  },
  stock: {
    type: Number,
    min: 1,
    required: true,
  },
  images: [
    {
      url: { type: String },
      imageId: { type: String },
    },
  ],
  inStock: {
    type: Boolean,
    default: true,
  },
});

export const Product = mongoose.model("Product", productSchema);
