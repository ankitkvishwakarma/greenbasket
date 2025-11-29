import User from "../models/User.js";
import Product from "../models/Products.js";
import Order from "../models/Order.js";
import DeliveryBoy from "../models/DeliveryBoy.js";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../utils/generateJwt.js";


/* ================================
        ADMIN LOGIN
================================ */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, role: "ADMIN" });
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
   CREATE DELIVERY BOY ACCOUNT
================================ */
export const createDeliveryBoy = async (req, res) => {
  try {
    const { name, email, password, phone, vehicleNumber } = req.body;

    // ❗ सही duplicate check User table से होगा (पहले गलत DeliveryBoy पर था)
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    // 🔥 Password hashing
    const hashedPass = await bcrypt.hash(password, 10);

    // 1) User login account create
    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPass,
      role: "DELIVERY"
    });

    // 2) DeliveryBoy profile create
    await DeliveryBoy.create({
      userId: user._id,
      name,
      phone,
      email,
      vehicleNumber,
      lastKnownLocation: { type: "Point", coordinates: [0, 0] } // default to avoid geo error
    });

    return res.status(201).json({ message: "Delivery Boy Created Successfully" });

  } catch (err) {
    console.log("DELIVERY BOY ERROR:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};



/* ================================
          GET USERS
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
       PRODUCT CONTROL
================================ */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);

  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json({ message: "Product Added", product });

  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Product Deleted" });

  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};



/* ================================
          ORDER CONTROL
================================ */
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId")
      .populate("items.productId");

    return res.status(200).json(orders);

  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};



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
