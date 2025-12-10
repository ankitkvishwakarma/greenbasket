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
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================================
   CREATE DELIVERY BOY ACCOUNT
================================ */
export const createDeliveryBoy = async (req, res) => {
  try {
    const { name, email, password, phone, vehicleNumber } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already registered" });

    const hashedPass = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPass,
      role: "DELIVERY"
    });

    await DeliveryBoy.create({
      userId: user._id,
      name,
      phone,
      email,
      vehicleNumber,
      lastKnownLocation: { type: "Point", coordinates: [0, 0] }
    });

    return res.status(201).json({ message: "Delivery Boy Created Successfully" });

  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};


/* ================================
        GET ALL ORDERS → ADMIN
================================ */
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name email")
      .populate("items.productId");

    return res.status(200).json({ orders });

  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};


/* ================================
        ASSIGN DELIVERY BOY
================================ */
export const assignDeliveryBoy = async (req, res) => {
  try {
    const { deliveryBoyId } = req.body;
    const { orderId } = req.params;

    if (!deliveryBoyId)
      return res.status(400).json({ message: "deliveryBoyId is required" });

    const order = await Order.findById(orderId);
    if (!order)
      return res.status(404).json({ message: "Order not found" });

    order.deliveryBoyId = deliveryBoyId;
    order.status = "ASSIGNED";

    await order.save();

    return res.status(200).json({
      message: "Delivery Boy Assigned Successfully",
      order
    });

  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};


/* ================================
           GET ALL USERS
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
    return res.status(200).json({ products });

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
