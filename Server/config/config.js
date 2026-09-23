import dotenv from "dotenv";
dotenv.config();

if (!process.env.PORT) {
  throw new Error("PORT is not defined in the environment vairable");
}

if (!process.env.MONGO_URL) {
  throw new Error("MONGO_URL is not defined in the environment vairable");
}

if (!process.env.CLOUDINARY_NAME) {
  throw new Error("CLOUDINARY_NAME is not defined in the environment vairable");
}

if (!process.env.CLOUDINARY_API_KEY) {
  throw new Error("CLOUDINARY_API_KEY is not defined in the environment vairable");
}

if (!process.env.CLOUDINARY_API_SECRET) {
  throw new Error("CLOUDINARY_SECRET is not defined in the environment vairable");
}

export const config = {
  port: process.env.PORT,
  mongoUrl: process.env.MONGO_URL,
  cloudinaryName: process.env.CLOUDINARY_NAME,
  cloudinary_apiKey: process.env.CLOUDINARY_API_KEY,
  cloudinary_apiSecret: process.env.CLOUDINARY_API_SECRET,
};
