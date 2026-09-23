import { v2 as cloudinary } from "cloudinary";
import { config } from "./config.js";

cloudinary.config({
  cloud_name: config.cloudinaryName,
  api_key: config.cloudinary_apiKey,
  api_secret: config.cloudinary_apiSecret,
});

export default cloudinary;
