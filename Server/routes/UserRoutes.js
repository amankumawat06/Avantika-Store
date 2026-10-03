import { Router } from "express";
const router = Router();
import {
  createUser,
  login,
  getUserInfo,
  getAllUsers,
  update,
  deleteUser,
  deleteAllUsers,
  logout,
} from "../controllers/UserController.js";
import { upload } from "../middlewares/upload.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isAdmin } from "../middlewares/Role.js";

router.post("/create-account", upload.single("image"), createUser);
router.post("/login", login);
router.get("/get-me", verifyToken, getUserInfo);
router.get("/users", verifyToken, isAdmin, getAllUsers);
router.get("/logout", verifyToken, logout);
router.patch("/edit/:id", verifyToken, update);
router.delete("/delete/all-users", verifyToken, isAdmin, deleteAllUsers);
router.delete("/delete/:id", verifyToken, isAdmin, deleteUser);

export default router;
