import mongoose from "mongoose";
import { Order } from "../models/OrderModel.js";
import { Address } from "../models/AddressModel.js";
import { Cart } from "../models/CartModel.js";

export const createOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthenticated! login to order something!",
      });
    }

    const { addressId } = req.params;

    if (!addressId) {
      return res.status(400).json({
        message: "address Id is required!",
      });
    }

    if (!mongoose.isValidObjectId(addressId)) {
      return res.status(400).json({
        message: "Invalid address Id!",
      });
    }

    const userAddress = await Address.findOne({
      _id: addressId,
      userId: req.user.id,
    });

    if (!userAddress) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    const userCart = await Cart.findOne({ userId: req.user.id })
      .populate("userId", "name, email")
      .populate("items.productId", "name price stock images.url");

    if (!userCart || userCart.items.length === 0) {
      return res.status(200).json({
        message: "Your cart is Empty!",
      });
    }

    for (let item of userCart.items) {
      const product = item.productId;

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficent stock! for ${product.name}`,
        });
      }
    }

    const orderItems = userCart.items.map((item) => {
      const product = item.productId;

      return {
        productId: product._id,
        name: product.name,
        image: product.images?.[0]?.url,
        price: product.price,
        quantity: item.quantity,
        total: product.price * item.quantity,
      };
    });

    console.log(orderItems);

    //calculate sub-total
    const subtotal = orderItems.reduce((total, item) => {
      return total + item.total;
    }, 0);

    let shippingCharges = 0;

    if (subtotal < 200) {
      shippingCharges = 50;
    }

    const total = subtotal + shippingCharges;

    const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      shippingAddress: {
        name: userAddress.name,
        phone: userAddress.phone,
        address: userAddress.userAddress,
        city: userAddress.city,
        state: userAddress.state,
        country: userAddress.country,
        pincode: userAddress.pincode,
      },
      subtotal,
      shippingCharges: shippingCharges,
      totalAmout: total,
      paymentMenthod: "COD",
    });

    userCart.items = [];
    await userCart.save();

    return res.status(201).json({
      message: "Order created succerssfully!",
      order,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to cretae Order!",
      error: err.message,
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthenticated! login to get your orders",
      });
    }

    const orders = await Order.find({ userId: req.user.id });

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: "No order found!",
      });
    }

    return res.status(200).json({
      message: "Order fetched!",
      totalOrders: orders.length,
      orders,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to get Orders!",
      error: err.message,
    });
  }
};

export const getOrderDetail = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthenticated! login to get your orders",
      });
    }

    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        message: "order id is required!",
      });
    }

    if (!mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({
        message: "Invalid order Id!",
      });
    }

    const order = await Order.findOne({
      userId: req.user.id,
      _id: orderId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found!",
      });
    }

    return res.status(200).json({
      message: "Order fetched!",
      order,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to get order detail!",
      error: err.message,
    });
  }
};

export const updateOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthenticated! login to get your orders",
      });
    }

    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        message: "order Id is required!",
      });
    }

    if (!mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({
        message: "Invalid order Id!",
      });
    }
    const { orderStatus } = req.body || {};

    if (!orderStatus) {
      return res.status(200).json({
        message: "You haven't updated anything in this order data!",
      });
    }

    const order = await Order.findOneAndUpdate(
      {
        userId: req.user.id,
        _id: orderId,
      },
      {
        $set: {
          orderStatus,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found!",
      });
    }

    await order.save();

    return res.status(200).json({
      message: "order status updated!",
      order,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to update order!",
      error: err.message,
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthenticated!, login to update your order",
      });
    }

    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        message: "Order Id is required!",
      });
    }

    if (!mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({
        message: "Invalid userId",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      userId: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found!",
      });
    }

    if (order.orderStatus === "pending") {
      order.orderStatus = "cancelled";
      return res.status(400).json({
        message: "Your order has been cancelled!",
      });
    }

    if (order.orderStatus === "cancelled") {
      return res.status(400).json({
        message:
          "You can not updated the product status once product cancelled",
      });
    }

    await order.save();

    return res.status(200).json({
      message: "Order cancelled successfully!",
      cancelledOrder: order,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to cancel order!",
      error: err.message,
    });
  }
};
