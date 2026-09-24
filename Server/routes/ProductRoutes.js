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

router.post("/create", upload.array("image"), createProduct);
router.get("/all", getAllProducts);
router.get("/:id", getSingleProduct);
router.delete("/delete/:id", deleteProduct);
router.patch("/update/:id", upload.array("images"), updateProduct);

export default router;
