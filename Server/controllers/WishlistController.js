import { Wishlist } from "../models/WishlistModel.js";
import { Product } from "../models/ProductModel.js";
import mongoose from "mongoose";

export const addToWishlist = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({
        message: "Login to Add Item to Wishlist!",
      });
    }

    const { productId } = req.body || {};

    if (!productId) {
      return res.status(400).json({
        message: "Product Id is required1",
      });
    }

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        message: "Invalid Product Id",
      });
    }

    const product = await Product.findOne({ _id: productId });

    if (!product) {
      return res.status(404).json({
        message: "Product not found!",
      });
    }

    let wishlist = await Wishlist.findOne({
      userId: req.user.id,
    });

    // check wishlist exists
    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId: req.user.id,
        items: [
          {
            productId,
          },
        ],
      });

      return res.status(201).json({
        message: "Product Added to Wishlist",
        wishlist,
      });
    }

    const existingProduct = wishlist.items.find(
      (item) => item.productId.toString() === productId,
    );

    if (existingProduct) {
      return res.status(400).json({
        message: "This product already exists in the wishlist!",
      });
    } else {
      wishlist.items.push({
        productId,
      });
    }

    await wishlist.save();

    return res.status(201).json({
      message: "Product Added to Wishlist",
      wishlist,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to add item to cart",
      error: err.message,
    });
  }
};

export const getWishlistItems = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Login to access your cart!",
      });
    }

    const wishlist = await Wishlist.findOne({ userId: req.user.id });

    if (!wishlist) {
      return res.status(200).json({
        message: "No Items found in the wishlist!",
        wishlist: [],
      });
    }

    return res.status(200).json({
      message: "Wishlist items fetched!",
      wishlist,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to add item to wishlist!",
    });
  }
};

export const getWishlistItemsDetail = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Login to view Wishlist Item Detail",
      });
    }

    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        message: "product id is required!",
      });
    }

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        message: "Invalid product Id",
      });
    }

    const product = await Product.findOne({ _id: productId });

    if (!product) {
      return res.status(404).json({
        message: "product not found",
      });
    }

    return res.status(200).json({
      message: "product details reterived!",
      product,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to get Item details",
      error: err.message,
    });
  }
};

export const deleteWishlistProduct = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Login to delete  the wishkist item!",
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

    const wishlist = await Wishlist.findOneAndUpdate(
      {
        userId: req.user.id,
        "items.productId": productId,
      },
      {
        $pull: {
          items: { productId },
        },
      },
      { new: true },
    );

    if (!wishlist) {
      return res.status(404).json({
        message: "Product not found!",
      });
    }

    return res.status(200).json({
      message: "Item removed from the cart!",
      deletedItem: wishlist,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to delete item from cart",
      error: err.message,
    });
  }
};
