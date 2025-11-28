import express from "express";
import { auth, requireRole } from "../middlewares/auth.middleware.js";
import {
  getProducts,
  getProductById,
  createProduct
} from "../controllers/product.controller.js";

const router = express.Router();

// PUBLIC
router.get("/", getProducts);
router.get("/:id", getProductById);

// ADMIN ONLY — Product create
router.post("/create", auth, requireRole("ADMIN"), createProduct);

export default router;
