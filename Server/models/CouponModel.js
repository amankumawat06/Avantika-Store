import mongoose from "mongoose";

export const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      uppercase: true,
      required: true,
    },
    couponCode: {
      type: String,
      trim: true,
      required: true,
    },
    vaildFrom: {
      type: Date,
      default: Date.now(),
    },
    vaildTo: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

export const Coupon = mongoose.model("Coupon", couponSchema);
