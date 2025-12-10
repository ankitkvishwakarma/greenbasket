import express from "express";
import { auth, requireRole, adminOnly } from "../middlewares/auth.middleware.js";
import { 
  adminLogin, 
  getAllUsers, 
  getAllProducts,
  getOrders,
  addProduct,
  deleteProduct,
  createDeliveryBoy,
  assignDeliveryBoy
} from "../controllers/admin.controller.js";

const router = express.Router();

// Public → Admin Login
router.post("/login", adminLogin);

// Protected → Only Admin
router.use(auth, adminOnly);

// Users
router.get("/users", getAllUsers);

// Delivery Boy Create
router.post("/delivery/create", requireRole("ADMIN"), createDeliveryBoy);

// Orders (⭐ FIXED)
router.get("/orders", getOrders);

// Delivery Assign
router.post("/assign/:orderId", assignDeliveryBoy);

// Products
router.get("/products", getAllProducts);
router.post("/products", addProduct);
router.delete("/products/:id", deleteProduct);

// ❌ REMOVE OLD ORDER ROUTES
// router.get("/orders", getOrders);
// router.put("/orders/:id", updateOrderStatus);

export default router;
