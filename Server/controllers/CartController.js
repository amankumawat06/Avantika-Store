import mongoose from "mongoose";
import { Cart } from "../models/CartModel.js";
import { Product } from "../models/ProductModel.js";

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body || {};

    if (!req.user) {
      return res.status(401).json({
        message: "Unauthenticated",
      });
    }

    if (!productId) {
      return res.status(400).json({
        message: "product id is required!",
      });
    }

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        message: "Invalid product Id!",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found!",
      });
    }

    //check user cart
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      //create cart
      cart = await Cart.create({
        userId: req.user.id,
        items: [
          {
            productId,
            quantity: 1,
          },
        ],
      });

      return res.status(201).json({
        message: "product added to cart",
        cart,
      });
    }

    // check if item already exists in the cart
    const existingItem = cart.items.find((item) => {
      return item.productId.toString() === productId;
    });

    // 8. If exists --> increase quantity
    if (existingItem) {
      existingItem.quantity += 1;
    }
    // 9. If doesn't exist → add new item to cart
    else {
      cart.items.push({
        productId,
        quantity: 1,
      });
    }
    await cart.save();

    return res.status(200).json({
      message: existingItem
        ? "Product Quantity Increased"
        : "Product added to cart",
      cart,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to Add Product to cart!",
      error: err.message,
    });
  }
};

export const getCartProducts = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Login to view access your cart!",
      });
    }

    const cart = await Cart.findOne({ userId: req.user.id })
      .populate("userId", "name email")
      .populate("items.productId", "name price -_id");

    if (!cart) {
      return res.status(200).json({
        message: "Your cart is Empty!",
        cart: [],
      });
    }

    return res.status(200).json({
      message: "Cart Items reterived!",
      cart,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to get cart",
      error: err.message,
    });
  }
};

export const getCartProductDetail = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Login to view access your cart!",
      });
    }

    const { cartProductId } = req.params;

    if (!cartProductId) {
      return res.status(400).json({
        message: "Product Id is required!",
      });
    }

    if (!mongoose.isValidObjectId(cartProductId)) {
      return res.status(400).json({
        message: "Invalid Product Id!",
      });
    }

    const cartItem = await Product.findOne({ _id: cartProductId });

    if (!cartItem) {
      return res.status(404).json({
        message: "Product no found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fetched cart Item details",
      cartItem,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to get cart details",
      error: err.message,
    });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({
        message: "Login to delete cart item!",
      });
    }

    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        message: "Product Id is  required!",
      });
    }

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        message: "Invalid product Id",
      });
    }

    const cart = await Cart.findOneAndUpdate(
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

    if (!cart) {
      return res.status(404).json({
        message: "Product not found!",
      });
    }

    return res.status(200).json({
      message: "Item removed from cart",
      deletedItem: cart,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to delete cart item!",
      error: err.message,
    });
  }
};

export const UpdateCartItem = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({
        message: "Login to update cart item!",
      });
    }

    const { productId } = req.params;
    const { quantity } = req.body || {};

    if (!productId) {
      return res.status(400).json({
        message: "Product Id is required!",
      });
    }

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        message: "Invalid product Id",
      });
    }

    if (!quantity) {
      return res.status(400).json({
        message: "quantity is required! to update the item",
      });
    }

    const cart = await Cart.findOneAndUpdate(
      {
        userId: req.user.id,
        "items.productId": productId,
      },
      {
        $set: {
          items: { quantity },
        },
      },
      { new: true },
    );

    if (!cart) {
      return res.status(404).json({
        message: "Product not found!",
      });
    }

    return res.status(200).json({
      message: "Item updated from cart",
      deletedItem: cart,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to update the cart item!",
      error: err.message,
    });
  }
};
