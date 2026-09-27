import mongoose from "mongoose";
import { Address } from "../models/AddressModel.js";

export const createAddress = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Login to add a new address!",
      });
    }

    const {
      name,
      phone,
      userAddress,
      addressType,
      city,
      state,
      country,
      pincode,
      isDefault,
    } = req.body || {};

    if (
      !name ||
      !phone ||
      !userAddress ||
      !addressType ||
      !city ||
      !state ||
      !country ||
      !pincode
    ) {
      return res.status(400).json({
        message: "required fields can not be empty!",
      });
    }

    // check address exist for the user or not
    let address = await Address.findOne({ userId: req.user.id });

    if (!address) {
      address = await Address.create({
        userId: req.user.id,
        addresses: [
          {
            name,
            phone,
            userAddress,
            addressType,
            city,
            state,
            country,
            pincode,
            isDefault,
          },
        ],
      });
    } else {
      address.addresses.push({
        name,
        phone,
        userAddress,
        addressType,
        city,
        state,
        country,
        pincode,
        isDefault,
      });
      await address.save();

      return res.status(201).json({
        message: address ? "New Address created" : "Address created!",
        address,
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Failed to create address!",
      error: err.message,
    });
  }
};

export const getAllAddresses = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthenticated!, Login to view your addresses",
      });
    }

    const address = await Address.findOne({ userId: req.user.id });

    if (!address) {
      return res.status(404).json({
        message: "No addresses found!",
      });
    }

    return res.status(200).json({
      message: "addresses fetched successfully!",
      address,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to get addresses!",
      error: err.message,
    });
  }
};

export const getAddressDetail = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({
        message: "Unauthenticated! Login to view address detail!",
      });
    }

    const { addressId } = req.params;

    if (!addressId) {
      return res.status(400).json({
        message: "Address Id is required!",
      });
    }

    if (!mongoose.isValidObjectId(addressId)) {
      return res.status(400).json({
        message: "Invalid Address Id!",
      });
    }

    const address = await Address.findOne({
      userId: req.user.id,
      "addresses._id": addressId,
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found!",
      });
    }

    return res.status(200).json({
      message: "Address details reterived!",
      address,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to get address",
      error: err.message,
    });
  }
};
