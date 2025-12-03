// backend/routes/product.routes.js
import express from "express";
import { auth, requireRole } from "../middlewares/auth.middleware.js";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller.js";

const router = express.Router();

// PUBLIC
router.get("/", getProducts);
router.get("/:id", getProductById);

// ADMIN ONLY
router.post("/create", auth, requireRole("ADMIN"), createProduct);
router.put("/:id", auth, requireRole("ADMIN"), updateProduct);
router.delete("/:id", auth, requireRole("ADMIN"), deleteProduct);

export default router;
