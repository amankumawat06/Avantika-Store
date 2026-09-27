import mongoose from "mongoose";

export const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    addresses: [
      {
        name: {
          type: String,
          trim: true,
          required: true,
        },
        phone: {
          type: String,
          trim: true,
          required: true,
          match: /^[6-9]\d{9}$/,
        },
        userAddress: {
          type: String,
          required: true,
        },
        addressType: {
          type: String,
          enum: ["Home", "Work", "Other"],
        },
        city: {
          type: String,
          trim: true,
          required: true,
        },
        state: {
          type: String,
          trim: true,
          required: true,
        },
        country: {
          type: String,
          trim: true,
          required: true,
          default: "India",
        },
        pincode: {
          type: String,
          trim: true,
          required: true,
          match: /^\d{6}$/,
        },
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true },
);

export const Address = mongoose.model("Address", addressSchema);
