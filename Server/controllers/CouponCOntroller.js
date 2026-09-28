import mongoose, { mongo } from "mongoose";
import { Coupon } from "../models/CouponModel.js";
import { User } from "../models/UserModel.js";

export const createCoupon = async (req, res) => {
  try {
    const { name, couponCode, vaildFrom, vaildTo } = req.body || {};

    if (!name || !couponCode || !vaildTo) {
      return res.status(400).json({
        message: "required fields can not be empty",
      });
    }

    const existingCoupon = await Coupon.findOne({ couponCode });

    if (existingCoupon) {
      return res.status(403).json({
        message: "Coupon already exists!",
      });
    }

    const coupon = await Coupon.create({
      name,
      couponCode,
      vaildFrom,
      vaildTo,
    });

    return res.status(201).json({
      message: "Coupon created!",
      coupon,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to create coupon!",
      error: err.message,
    });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthenticated! login to access coupons",
      });
    }

    const coupons = await Coupon.find({});

    if (coupons.length === 0) {
      return res.status(200).json({
        message: "No coupons found!",
        coupons: [],
      });
    }

    return res.status(200).json({
      message: "coupons fetched successfully!",
      total: coupons.length,
      coupons,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to get coupons!",
      error: err.message,
    });
  }
};

export const getCouponDetail = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthenticated! login to access coupon",
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Coupon Id is required!",
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(200).json({
        message: "Invalid Coupon Id",
      });
    }

    const coupon = await Coupon.findById(id);

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found!",
      });
    }

    return res.status(200).json({
      message: "coupons Details fetched!",
      coupon,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to get coupon detail!",
      error: err.message,
    });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthenticated! login to delete a coupon",
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Coupon Id is required!",
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(200).json({
        message: "Invalid Coupon Id",
      });
    }

    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found!",
      });
    }

    return res.status(200).json({
      message: "coupons Deleted!",
      coupon,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to get coupon detail!",
      error: err.message,
    });
  }
};

export const UpdateCoupon = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthenticated! login to update coupon",
      });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Coupon Id is required!",
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(200).json({
        message: "Invalid Coupon Id",
      });
    }

    const { name, vaildFrom, vaildTo } = req.body;

    if (
      name === undefined &&
      vaildFrom === undefined &&
      vaildTo === undefined
    ) {
      return res.status(200).json({
        message: "You haven't updated anything in this coupon data!",
      });
    }

    const coupon = await Coupon.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          vaildFrom,
          vaildTo,
        },
      },
      { new: true },
    );

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found!",
      });
    }

    return res.status(200).json({
      message: "coupons updated!",
      updatedCoupon: coupon,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to delete coupon!",
      error: err.message,
    });
  }
};
