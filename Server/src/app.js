import express from "express";
const app = express();
import cookieParser from "cookie-parser";

app.use(express.json());
app.use(cookieParser());

import userRoutes from "../routes/UserRoutes.js";
import productRoutes from "../routes/ProductRoutes.js";
import cartRoutes from "../routes/CartRoutes.js";
import wishlistRoutes from "../routes/WishlistRoutes.js";
import addressRouters from "../routes/AddressRoutes.js";
import couponRoutes from "../routes/CouponRoutes.js";
import reviewRoutes from "../routes/ReviewRoutes.js";
import orderRoutes from "../routes/OrderRoutes.js";

app.use("/api/auth", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/address", addressRouters);
app.use("/api/coupon", couponRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/order", orderRoutes);

export default app;
