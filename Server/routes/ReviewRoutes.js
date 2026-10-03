import { Router } from "express";
const router = Router();
import {
  addReview,
  getReviews,
  getMyReview,
  updateMyReview,
  deleteMyReview,
} from "../controllers/ReviewController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/Role.js";

router.post("/add", verifyToken, addReview);
router.get("/detail/:productId", verifyToken, getMyReview);
router.get("/:productId", verifyToken, isAdmin, getReviews);
router.patch("/update/:productId", verifyToken, updateMyReview);
router.delete("/delete/:productId", verifyToken, deleteMyReview);

export default router;
