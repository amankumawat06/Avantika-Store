import { Router } from "express";
const router = Router();
import {
  createAddress,
  getAllAddresses,
  getAddressDetail,
} from "../controllers/AddressController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

router.post("/add", verifyToken, createAddress);
router.get("/get", verifyToken, getAllAddresses);
router.get("/:addressId", verifyToken, getAddressDetail);

export default router;
