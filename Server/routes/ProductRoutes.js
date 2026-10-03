import { Router } from "express";
const router = Router();
import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/ProductController.js";
import { upload } from "../middlewares/upload.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/Role.js";

router.post(
  "/create",
  verifyToken,
  isAdmin,
  upload.array("image"),
  createProduct,
);
router.get("/all", getAllProducts);
router.get("/:id", getSingleProduct);
router.delete("/delete/:id", verifyToken, isAdmin, deleteProduct);
router.patch(
  "/update/:id",
  verifyToken,
  isAdmin,
  upload.array("images"),
  updateProduct,
);

export default router;
