import express from "express";
import { auth, requireRole } from "../middlewares/auth.middleware.js";
import {
  getAssignedOrders,
  updateOrderStatusByDelivery,
  updateDeliveryLocation,
} from "../controllers/delivery.controller.js";

const router = express.Router();

router.use(auth, requireRole("DELIVERY"));

router.get("/orders", getAssignedOrders);
router.put("/orders/:id/status", updateOrderStatusByDelivery);
router.post("/location", updateDeliveryLocation);

export default router;
