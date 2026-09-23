import mongoose from "mongoose";
import { config } from "../config/config.js";
import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

export const ConnectToDB = async () => {
  try {
    await mongoose.connect(config.mongoUrl);
    console.log("Connected to Database!");
  } catch (err) {
    console.log("Failed to connect DB!", err);
  }
};
