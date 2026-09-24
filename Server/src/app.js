import express from "express";
const app = express();
import cookieParser from "cookie-parser";

app.use(express.json());
app.use(cookieParser());

import userRoutes from "../routes/UserRoutes.js";
import productRoutes from "../routes/ProductRoutes.js";

app.use("/api/auth", userRoutes);
app.use("/api/product", productRoutes);

export default app;
