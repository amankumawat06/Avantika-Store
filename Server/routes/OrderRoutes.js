import { Router } from "express";
const router = Router();
import {
  createOrder,
  getOrders,
  getOrderDetail,
  updateOrder,
  cancelOrder,
} from "../controllers/OrderController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/Role.js";

router.post("/create/:addressId", verifyToken, createOrder);
router.get("/get", verifyToken, getOrders);
router.get("/:orderId", verifyToken, getOrderDetail);
router.patch("/update/:orderId", verifyToken, isAdmin, updateOrder);
router.patch("/cancel/:orderId", verifyToken, cancelOrder);

export default router;
