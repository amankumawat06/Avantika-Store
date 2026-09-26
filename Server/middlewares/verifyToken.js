import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const verifyToken = (req, res, next) => {
  try {
    const authToken = req.cookies.auth_access;

    if (!authToken) {
      return res.status(401).json({
        message: "Unauthenticated!",
      });
    }

    const decoded = jwt.verify(authToken, config.jwt_secret);

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      message: "Invalid or expired token",
    });
  }
};
