import mongoose, { mongo } from "mongoose";
import { Review } from "../models/ReviewModel.js";
import { Product } from "../models/ProductModel.js";

export const addReview = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Login to add a review!",
      });
    }

    const { productId, rating, comment } = req.body || {};

    if (!rating || !productId) {
      return res.status(400).json({
        message: "rating and productId is required!",
      });
    }

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        message: "Invalid product Id",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "This product does not exists",
      });
    }

    const review = await Review.create({
      userId: req.user.id,
      productId: productId,
      rating,
      comment,
    });

    return res.status(201).json({
      message: "Review added!",
      review,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to add review",
      error: err.message,
    });
  }
};

export const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        message: "product Id is required",
      });
    }

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        message: "Invalid product Id",
      });
    }

    const reviews = await Review.find({ productId: productId });

    if (reviews.length === 0) {
      return res.status(200).json({
        message: "No reviews found for this product!",
        reviews: {},
      });
    }

    return res.status(200).json({
      message: "All reviews of this product are reterived!",
      total: reviews.length,
      reviews,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to get reviews",
      error: err.message,
    });
  }
};

export const getMyReview = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        message: "product Id is required",
      });
    }

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        message: "Invalid product Id",
      });
    }

    const review = await Review.find({
      userId: req.user.id,
      productId: productId,
    });

    if (!review) {
      return res.status(200).json({
        message: "No reviews found!",
        review: {},
      });
    }

    return res.status(200).json({
      message: "Review detail fetched!",
      review,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to get reviews",
      error: err.message,
    });
  }
};

export const updateMyReview = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Login to update your review",
      });
    }

    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!productId) {
      return res.status(400).json({
        message: "product Id is required",
      });
    }

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        message: "Invalid product Id",
      });
    }

    if (rating === undefined && comment === undefined) {
      return res.status(200).json({
        message: "You updated nothing in this data!",
      });
    }

    const review = await Review.findOneAndUpdate(
      {
        userId: req.user.id,
        productId: productId,
      },
      {
        $set: {
          rating,
          comment,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!review) {
      return res.status(200).json({
        message: "Reviews not found!",
      });
    }

    return res.status(200).json({
      message: "Review updated successfully!",
      review,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to get reviews",
      error: err.message,
    });
  }
};

export const deleteMyReview = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Login to delete your review",
      });
    }

    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        message: "product Id is required",
      });
    }

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        message: "Invalid product Id",
      });
    }

    const review = await Review.findOneAndDelete(
      {
        userId: req.user.id,
        productId: productId,
      },
      {
        $pull: {
          productId: productId,
        },
      },
    );

    if (!review) {
      return res.status(200).json({
        message: "Reviews not found!",
      });
    }

    return res.status(200).json({
      message: "Review deleted successfully!",
      deletedReview: review,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to delete reviews",
      error: err.message,
    });
  }
};
