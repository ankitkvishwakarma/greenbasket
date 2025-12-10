import express from "express";
import { auth, requireRole } from "../middlewares/auth.middleware.js";

import {
  checkoutFromCart,
  getMyOrders,
  getOrderByIdUser,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
  assignDeliveryBoyAdmin,
  getDeliveryBoyOrders,
} from "../controllers/order.controller.js";

const router = express.Router();

// USER ROUTES
router.post("/checkout", auth, checkoutFromCart);
router.get("/my", auth, getMyOrders);
router.get("/:id", auth, getOrderByIdUser);

// ADMIN ROUTES
router.get("/admin/all", auth, requireRole("ADMIN"), getAllOrdersAdmin);
router.put("/admin/:id/status", auth, requireRole("ADMIN"), updateOrderStatusAdmin);
router.put("/admin/:id/assign", auth, requireRole("ADMIN"), assignDeliveryBoyAdmin);

// DELIVERY BOY ROUTES
router.get("/delivery/my", auth, requireRole("DELIVERY"), getDeliveryBoyOrders);

export default router;
