import express from "express";
const app = express();
import cookieParser from "cookie-parser";

app.use(express.json());
app.use(cookieParser());

import userRoutes from "../routes/UserRoutes.js";

app.use("/api/auth", userRoutes);

export default app;
