import express from "express";
import { auth, requireRole } from "../middlewares/auth.middleware.js";
import {
  checkoutFromCart,
  getMyOrders,
  getOrderByIdUser,
  getAllOrdersAdmin,
  updateOrderStatusAdmin,
} from "../controllers/order.controller.js";

const router = express.Router();

// user
router.post("/checkout", auth, checkoutFromCart);
router.get("/my", auth, getMyOrders);
router.get("/:id", auth, getOrderByIdUser);

// admin
router.get("/admin/all", auth, requireRole("ADMIN"), getAllOrdersAdmin);
router.put(
  "/admin/:id/status",
  auth,
  requireRole("ADMIN"),
  updateOrderStatusAdmin
);

export default router;
