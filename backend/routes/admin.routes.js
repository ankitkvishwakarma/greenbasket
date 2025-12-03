import express from "express";
import { auth, requireRole } from "../middlewares/auth.middleware.js";
import { 
  adminLogin, 
  getAllUsers, 
  getAllProducts,
  addProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus,
  createDeliveryBoy,
  assignDeliveryBoy     // ✔ now perfect
} from "../controllers/admin.controller.js";

import { adminOnly } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public → Admin Login
router.post("/login", adminLogin);

// Protected → Only Admin
router.use(auth, adminOnly);

// Users
router.get("/users", getAllUsers);

// Delivery Boy Create
router.post("/delivery/create", requireRole("ADMIN"), createDeliveryBoy);

// Delivery Assign (FIXED: use params)
router.post("/assign/:orderId", assignDeliveryBoy);

// Products
router.get("/products", getAllProducts);
router.post("/products", addProduct);
router.delete("/products/:id", deleteProduct);

// Orders
router.get("/orders", getOrders);
router.put("/orders/:id", updateOrderStatus);

export default router;
