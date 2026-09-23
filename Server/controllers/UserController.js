import { User } from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { config } from "../config/config.js";
import mongoose from "mongoose";
import cloudinary from "cloudinary";
import nodemailer from "nodemailer";

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Required fields can not be empty!",
      });
    }

    if (password.length < 5) {
      return res.status(400).json({
        message: "Password must be at least 5 digits",
      });
    }

    if (req.file && req.file.size > 10 * 1024 * 1024) {
      return res.status(400).json({
        message: "Image size cannot exceed 10MB",
      });
    }

    const isUserExist = await User.findOne({ email }).select("-password");

    if (isUserExist) {
      return res.status(403).json({
        message: "User Already exists!, try different email",
      });
    }

    let result;

    if (req.file) {
      result = await uploadToCloudinary(req.file.buffer, "AvantikaStore/Users");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      image: result?.secure_url,
      imageId: result?.public_id,
    });
    await user.save();

    return res.status(201).json({
      success: true,
      message: "User Account created!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        Image: user.image,
        ImageId: user.imageId,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create accoutn!, Don't worry it's not your fault",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Required fields can not be empty!",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found with these credentials",
      });
    }

    const isPassCorrect = await bcrypt.compare(password, user.password);

    if (!isPassCorrect) {
      return res.status(404).json({
        message: "User not found with these credentials",
      });
    }

    const authToken = jwt.sign(
      {
        id: user._id,
      },
      config.jwt_secret,
      {
        expiresIn: "7d",
      },
    );

    res.cookie("auth_access", authToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
      },
      authToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to login, But don't worry it's not your fault",
      error: error.message,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      return res.status(200).json({
        message: "No users found!",
        users: [],
      });
    }

    return res.status(200).json({
      message: "users fetched successfully!",
      total: users.length,
      users,
    });
  } catch (error) {}
};

export const getUserInfo = async (req, res) => {
  try {
    const authToken = req.cookies.auth_access;

    if (!authToken) {
      return res.status(404).json({
        message: "Authentication token not found",
      });
    }

    const decoded = jwt.verify(authToken, config.jwt_secret);

    if (!decoded) {
      return res.status(401).json({
        message: "Invalid or expired token",
      });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Details fetched",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Failed to get user details, but don't worry it's not your fault",
      error: error.message,
    });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "user id is required",
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid user Id",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    const { name, email } = req.body || {};

    if (!name && !email) {
      return res.status(200).json({
        message: "You haven't updated anything in this data!",
      });
    }

    name && (user.name = name);
    email && (user.email = email);

    await user.save();

    return res.status(200).json({
      message: "User details updated successfully!",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message:
        "Failed to update user detials, but don't worry it's not your fault",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { confirmation } = req.body || {};
    const confirmation_code = "delete-this-user";

    if (!id) {
      return res.status(400).json({
        message: "user id is required",
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid user Id",
      });
    }

    if (!confirmation) {
      return res.status(400).json({
        message: "confirmation is required",
      });
    }

    if (confirmation !== confirmation_code) {
      return res.status(400).json({
        message: "Invalid confirmation code",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.imageId) {
      await cloudinary.uploader.destroy(user.imageId);
    }

    const deleteduser = await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: `User '${deleteduser.email}' has been successfully deleted`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete user, but don't worry it's not your fault",
      error: error.message,
    });
  }
};

export const deleteAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp);

    const accessToken = req.cookies.auth_access;

    if (!accessToken) {
      return res.status(404).json({
        message: "Authentication token not found!",
      });
    }

    const decoded = jwt.verify(accessToken, config.jwt_secret);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    if (users.length === 0) {
      return res.status(200).json({
        message: "No users found!",
        users: [],
      });
    }

    // From which account you wants to send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.user,
        pass: config.password,
      },
    });

    await transporter.sendMail({
      from: config.user,
      to: config.admin,
      subject: "Confirmation Code",
      text: `Your confirmation code is ${otp}`,
    });

    await transporter.verify();

    console.log("SMTP connection successful!");

    return res.status(200).json({
      message: "All users deleted successfully!",
      total: users.deletedCount,
      users,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete users!",
      error: err.message,
    });
  }
};
