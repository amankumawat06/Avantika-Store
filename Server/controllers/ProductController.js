import mongoose from "mongoose";
import { Product } from "../models/ProductModel.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import cloudinary from "cloudinary";

export const createProduct = async (req, res) => {
  try {
    const { name, slug, desc, features, stock, inStock } = req.body;

    if (!name || !slug || !features || !stock) {
      return res.status(400).json({
        message: "Required fields can not be empty!",
      });
    }

    if (!req.files && req.files.length === 0) {
      return res.status(400).json({
        message: "product Images is required!",
      });
    }

    const isProductExist = await Product.findOne({ slug });

    if (isProductExist) {
      return res.status(403).json({
        message: "This product already exists!",
      });
    }

    const images = [];

    for (let file of req.files) {
      const result = await uploadToCloudinary(
        file.buffer,
        "AvantikaStore/Products",
      );

      images.push({
        url: result.secure_url,
        imageId: result.public_id,
      });
    }

    const parseFeatures = JSON.parse(features);

    const product = new Product({
      name,
      slug,
      desc,
      features: parseFeatures,
      stock,
      inStock,
      images,
    });

    await product.save();

    return res.status(201).json({
      success: true,
      message: "product created",
      product,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to create product!",
      error: err.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});

    if (products.length === 0) {
      return res.status(200).json({
        message: "No products found!",
        products: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "All products reterived",
      total: products.length,
      products,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products!",
    });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "product id is required!",
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid product Id",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "product not found!",
      });
    }

    return res.status(200).json({
      success: true,
      message: "product details fetched",
      product,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product!",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "product id is required!",
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid product Id",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "product not found!",
      });
    }

    // promise.all runs all images and delete them together it is fatster bcz it delete all the images simultaneously we can use fro loop to to delet imaegs
    await Promise.all(
      product.images.map((image) => {
        cloudinary.uploader.destroy(image.imageId);
      }),
    );

    const deletedToBeProduct = await Product.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "product deleted successfully!",
      deletedProduct: deletedToBeProduct,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete product!",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "product id is required!",
      });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid product Id",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "product not found!",
      });
    }

    const { name, slug, desc, features, stock, inStock } = req.body || {};

    if (!name && !slug && !desc && !features && !stock && !inStock) {
      return res.status(200).json({
        message: "You haven't updated anything in this data",
      });
    }

    const existinProduct = await Product.findOne({ slug, _id: { $ne: id } });

    if (existinProduct) {
      return res.status(403).json({
        message: "Product with this slug already exists!",
      });
    }

    if (name !== undefined) product.name = name;
    if (slug !== undefined) product.slug = slug;
    if (desc !== undefined) product.desc = desc;
    if (features !== undefined) product.features = JSON.parse(features);
    if (stock !== undefined) product.stock = stock;
    if (inStock !== undefined) product.inStock = inStock;

    if (req.files) {
      // delete old images
      await Promise.all(
        product.images.map((image) => {
          cloudinary.uploader.destroy(image.imageId);
          //  product.images.pop(image.imageId); remove images from database
        }),
      );

      product.images = []; // better to remove imaegs while upload new images

      //handle new uploaded images
      //   for (const file of req.files) {
      //     const result = await uploadToCloudinary(
      //       file.buffer,
      //       "AvantikaStore/Products",
      //     );

      //     product.images.push({
      //       url: result.secure_url,
      //       imageId: result.public_id,
      //     });
      //   }
    }

    // better and fast approch to upload images
    const uploadedImages = await Promise.all(
      req.files.map(async (file) => {
        const result = await uploadToCloudinary(
          file.buffer,
          "AvantikaStore/Products",
        );

        return {
          url: result.secure_url,
          imageId: result.public_id,
        };
      }),
    );

    product.images = uploadedImages;

    // const productToBeUpadted = await Product.findByIdAndUpdate(id);
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      product,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to updated product!",
      error: err.message,
    });
  }
};
