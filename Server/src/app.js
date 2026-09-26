import express from "express";
const app = express();
import cookieParser from "cookie-parser";

app.use(express.json());
app.use(cookieParser());

import userRoutes from "../routes/UserRoutes.js";
import productRoutes from "../routes/ProductRoutes.js";
import cartRoutes from "../routes/CartRoutes.js";
import wishlistRoutes from "../routes/WishlistRoutes.js";

app.use("/api/auth", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);

export default app;
