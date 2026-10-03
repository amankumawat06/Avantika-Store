import { Router } from "express";
const router = Router();
import {
  createCoupon,
  getAllCoupons,
  getCouponDetail,
  deleteCoupon,
  UpdateCoupon,
} from "../controllers/CouponController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/Role.js";

router.post("/create", verifyToken, isAdmin, createCoupon);
router.get("/get", verifyToken, isAdmin, getAllCoupons);
router.get("/:id", verifyToken, isAdmin, getCouponDetail);
router.delete("/delete/:id", verifyToken, isAdmin, deleteCoupon);
router.patch("/update/:id", verifyToken, isAdmin, UpdateCoupon);

export default router;
