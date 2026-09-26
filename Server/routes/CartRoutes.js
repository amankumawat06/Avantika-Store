import { Router } from "express";
const router = Router();
import {
  addToCart,
  getCartProducts,
  getCartProductDetail,
  deleteCartItem,
  UpdateCartItem,
} from "../controllers/CartController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

router.post("/add", verifyToken, addToCart);
router.get("/get", verifyToken, getCartProducts);
router.get("/:cartProductId", verifyToken, getCartProductDetail);
router.delete("/delete/:productId", verifyToken, deleteCartItem);
router.patch("/update/:productId", verifyToken, UpdateCartItem);

export default router;
