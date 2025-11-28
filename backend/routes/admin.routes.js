import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
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
router.get("/products", getAllProducts);
router.post("/products", addProduct);
router.delete("/products/:id", deleteProduct);

router.get("/orders", getOrders);
router.put("/orders/:id", updateOrderStatus);

export default router;
