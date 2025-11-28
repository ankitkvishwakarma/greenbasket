import User from "../models/User.js";
import Product from "../models/Products.js";
import Order from "../models/Order.js";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../utils/generateJwt.js";

/* ================================
    1) Admin Login
================================ */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, role: "ADMIN" }); // only admin
    if (!admin) return res.status(403).json({ message: "Not authorized" });

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateAccessToken(admin);

    return res.status(200).json({
      message: "Admin Logged In Successfully",
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email }
    });

  } catch (err) {
    console.error("Admin login error", err);
    return res.status(500).json({ message: "Server error" });
  }
};


/* ================================
    2) Get All Users
================================ */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    return res.status(200).json(users);

  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};


/* ================================
    3) Get All Products
================================ */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);

  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};


/* ================================
    4) Add Product
================================ */
export const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    return res.status(201).json({ message: "Product Added", product });

  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};


/* ================================
    5) Delete Product
================================ */
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Product Deleted" });

  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};


/* ================================
    6) Orders Control
================================ */
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user").populate("items.product");
    return res.status(200).json(orders);

  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};


/* ================================
    7) Update Order Status
================================ */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    return res.status(200).json({ message: "Order status updated", order });

  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
