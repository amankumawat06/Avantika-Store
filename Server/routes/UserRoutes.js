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
} from "../controllers/UserController.js";
import { upload } from "../middlewares/upload.js";

router.post("/create-account", upload.single("image"), createUser);
router.post("/login", login);
router.get("/get-me", getUserInfo);
router.get("/users", getAllUsers);
router.patch("/edit/:id", update);
router.delete("/delete/all-users", deleteAllUsers);
router.delete("/delete/:id", deleteUser);

export default router;
