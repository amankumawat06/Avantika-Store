import { Router } from "express";
const router = Router();
import {
  createAddress,
  getAllAddresses,
  getAddressDetail,
  updateAddress,
  deleteAddress,
} from "../controllers/AddressController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

router.post("/add", verifyToken, createAddress);
router.get("/get", verifyToken, getAllAddresses);
router.get("/:addressId", verifyToken, getAddressDetail);
router.patch("/update/:addressId", verifyToken, updateAddress);
router.delete("/delete/:addressId", verifyToken, deleteAddress);

export default router;
