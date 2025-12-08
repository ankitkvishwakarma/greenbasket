import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory     // <-- REQUIRED
} from "../controllers/product.controller.js";

const router = express.Router();

// CREATE PRODUCT
router.post("/", createProduct);

// GET ALL PRODUCTS
router.get("/", getProducts);

// GET PRODUCTS BY CATEGORY   <-- MUST BE ABOVE ID ROUTE
router.get("/category/:categoryName", getProductsByCategory);

// GET SINGLE PRODUCT BY ID
router.get("/:id", getProductById);

// UPDATE PRODUCT
router.put("/:id", updateProduct);

// DELETE PRODUCT
router.delete("/:id", deleteProduct);

export default router;
