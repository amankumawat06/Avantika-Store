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
    }

    return res.status(201).json({
      message: address ? "New Address created" : "Address created!",
      address,
    });
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

    const address = await Address.findOne(
      {
        userId: req.user.id,
        "addresses._id": addressId,
      },
      {
        addresses: {
          $elemMatch: {
            _id: addressId,
          },
        },
      },
    );

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

export const updateAddress = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(403).json({
        message: "Unauthenticated! Login to update address!",
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
      name === undefined &&
      phone === undefined &&
      userAddress === undefined &&
      addressType === undefined &&
      city === undefined &&
      state === undefined &&
      country === undefined &&
      pincode === undefined &&
      isDefault === undefined
    ) {
      return res.status(200).json({
        message: "You haven't updated anything in this address data",
      });
    }

    const address = await Address.findOneAndUpdate(
      {
        userId: req.user.id,
        "addresses._id": addressId, // User ke document ko filter kar rahe hain jisme addresses array ke andar given addressId exist karta hai.
      },
      {
        $set: {
          // $ positional operator us particular address ko refer karta hai jo upar filter me match hua hai.
          "addresses.$.name": name,
          "addresses.$.phone": phone,
          "addresses.$.userAddress": userAddress,
          "addresses.$.addressType": addressType,
          "addresses.$.city": city,
          "addresses.$.state": state,
          "addresses.$.country": country,
          "addresses.$.pincode": pincode,
          "addresses.$.isDefault": isDefault,
        },
      },
      { new: true },
    );
    console.log(address);

    if (!address) {
      return res.status(404).json({
        message: "Address not found!",
      });
    }

    // if (name !== undefined) address.addresses[0].name = name;
    // if (phone !== undefined) address.addresses[0].phone = phone;
    // if (userAddress !== undefined)
    //   address.addresses[0].userAddress = userAddress;
    // if (addressType !== undefined)
    //   address.addresses[0].addressType = addressType;
    // if (city !== undefined) address.addresses[0].city = city;
    // if (state !== undefined) address.addresses[0].state = state;
    // if (country !== undefined) address.addresses[0].country = country;
    // if (pincode !== undefined) address.addresses[0].pincode = pincode;
    // if (isDefault !== undefined) address.addresses[0].isDefault = isDefault;

    return res.status(200).json({
      message: "Address updated!",
      address,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to update address",
      error: err.message,
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthincated!, Login to delete your address!",
      });
    }

    const { addressId } = req.params;

    if (!addressId) {
      return res.status(400).json({
        message: "address Id is required!",
      });
    }

    if (!mongoose.isValidObjectId(addressId)) {
      return res.status(400).json({
        message: "Invalid address Id",
      });
    }

    const address = await Address.findOneAndUpdate(
      {
        userId: req.user.id,
        "addresses._id": addressId,
      },
      {
        $pull: {
          addresses: {
            _id: addressId,
          },
        },
      },
      { new: true },
    );

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    return res.status(200).json({
      message: "Address deleted",
      deletedAddress: address,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to delete address",
      error: err.message,
    });
  }
};
