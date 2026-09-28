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

router.post("/create", verifyToken, createCoupon);
router.get("/get", verifyToken, getAllCoupons);
router.get("/:id", verifyToken, getCouponDetail);
router.delete("/delete/:id", verifyToken, deleteCoupon);
router.patch("/update/:id", verifyToken, UpdateCoupon);

export default router;
