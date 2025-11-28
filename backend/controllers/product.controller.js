import Product from "../models/Products.js";

// ==================== ADMIN ==================== //


// Create Product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, discount } = req.body;

    const images = req.files?.map(file => file.path) || []; // multer image paths

    const product = await Product.create({
      name, description, price, category, stock, discount,
      images
    });

    return res.status(201).json({ message: "Product Created", product });
  } catch (err) {
    console.error("createProduct error", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = { ...req.body };

    if (req.files?.length > 0) {
      updateData.images = req.files.map(file => file.path);
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!product) return res.status(404).json({ message: "Product not found" });

    return res.status(200).json({ message: "Product Updated", product });
  } catch (err) {
    console.error("updateProduct error", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    return res.status(200).json({ message: "Product Deleted Successfully" });
  } catch (err) {
    console.error("deleteProduct error", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ==================== USER + PUBLIC ==================== //

// All Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    return res.status(200).json({ products });
  } catch (err) {
    console.error("getProducts error", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

// Single Product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product Not Found" });

    return res.status(200).json({ product });
  } catch (err) {
    console.error("getProductById error", err);
    return res.status(500).json({ message: "Server Error" });
  }
};
