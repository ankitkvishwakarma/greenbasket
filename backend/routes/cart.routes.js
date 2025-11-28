import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.use(auth); // all cart routes need login

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/item/:productId", removeCartItem);
router.delete("/clear", clearCart);

export default router;
