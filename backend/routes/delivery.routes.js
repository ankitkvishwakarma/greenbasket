import express from "express";
import { auth, requireRole } from "../middlewares/auth.middleware.js";

import {
  getAssignedOrders,
  updateOrderStatusByDelivery,
  updateDeliveryLocation,
} from "../controllers/delivery.controller.js";

const router = express.Router();

// Delivery Boy must be logged-in + must have DELIVERY role
router.use(auth, requireRole("DELIVERY"));

// Orders assigned to delivery boy
router.get("/orders", getAssignedOrders);

// Update status → PICKED / OUT_FOR_DELIVERY / DELIVERED
router.put("/orders/:id/status", updateOrderStatusByDelivery);

// Send live location to server (will broadcast using socket.io)
router.post("/location", updateDeliveryLocation);

export default router;
