import express from "express";
import { auth, requireRole } from "../middlewares/auth.middleware.js";
import {createDeliveryBoy, assignDeliveryBoy} from "../controllers/admin.controller.js";
import { adminOnly } from "../middlewares/auth.middleware.js";


import { 
  adminLogin, 
  getAllUsers, 
  getAllProducts,
  addProduct,
  deleteProduct,
  getOrders,
  updateOrderStatus
} from "../controllers/admin.controller.js";

const router = express.Router();

// Public → Admin Login
router.post("/login", adminLogin);

// Protected → Only Admin can access
router.use(auth, adminOnly);

router.get("/users", getAllUsers);
router.post("/delivery/create", auth, requireRole("ADMIN"), createDeliveryBoy);
router.post("/assign", assignDeliveryBoy);
router.get("/products", getAllProducts);
router.post("/products", addProduct);
router.delete("/products/:id", deleteProduct);

router.get("/orders", getOrders);
router.put("/orders/:id", updateOrderStatus);

export default router;
