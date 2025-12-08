import Product from "../models/Products.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

/* ===============================================
   Cloudinary Buffer Upload Helper
=============================================== */
function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "greenbasket/products" },
      (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

/* ===============================================
   CREATE PRODUCT
=============================================== */
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, discount } = req.body;

    let uploadedImages = [];

    if (req.files && req.files.images) {
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      uploadedImages = await Promise.all(
        files.map((file) => uploadToCloudinary(file.data))
      );
    }

    const product = await Product.create({
      name,
      description,
      category,
      price,
      stock,
      discount,
      images: uploadedImages,
    });

    return res.status(201).json({ message: "Product Created", product });
  } catch (err) {
    console.error("createProduct error", err);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ===============================================
   UPDATE PRODUCT
=============================================== */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    let updateData = { ...req.body };

    if (req.files && req.files.images) {
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];

      updateData.images = await Promise.all(
        files.map((file) => uploadToCloudinary(file.data))
      );
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    return res.status(200).json({ message: "Product Updated", product });
  } catch (err) {
    console.error("updateProduct error", err);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ===============================================
   DELETE PRODUCT
=============================================== */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    if (product.images?.length > 0) {
      for (let url of product.images) {
        try {
          const parts = url.split("/");
          const fileName = parts.pop().split(".")[0];
          await cloudinary.uploader.destroy(`greenbasket/products/${fileName}`);
        } catch (err) {
          console.log("Cloudinary delete failed:", err);
        }
      }
    }

    await Product.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Product Deleted Successfully",
      deleted: id,
    });
  } catch (err) {
    console.error("deleteProduct error", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

/* ===============================================
   GET ALL PRODUCTS
=============================================== */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ products });
  } catch (err) {
    console.error("getProducts error", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

/* ===============================================
   GET CATEGORY PRODUCTS   <-- NEW
=============================================== */
export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;

    const products = await Product.find({ category: categoryName });

    return res.status(200).json({ products });
  } catch (err) {
    console.error("getProductsByCategory error", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

/* ===============================================
   GET SINGLE PRODUCT
=============================================== */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product Not Found" });

    return res.status(200).json({ product });
  } catch (err) {
    console.error("getProductById error", err);
    return res.status(500).json({ message: "Server Error" });
  }
};
