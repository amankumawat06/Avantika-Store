import { Router } from "express";
const router = Router();
import {
  addToWishlist,
  getWishlistItems,
  getWishlistItemsDetail,
  deleteWishlistProduct,
} from "../controllers/WishlistController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

router.post("/add", verifyToken, addToWishlist);
router.get("/get", verifyToken, getWishlistItems);
router.get("/:productId", verifyToken, getWishlistItemsDetail);
router.patch("/update/:productId", verifyToken, deleteWishlistProduct);

export default router;
