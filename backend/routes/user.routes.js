import express from "express";
import { auth } from "../middlewares/auth.middleware.js";
import {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/user.controller.js";

const router = express.Router();

router.use(auth);

router.get("/me", getProfile);
router.put("/me", updateProfile);

router.get("/addresses", getAddresses);
router.post("/addresses", addAddress);
router.put("/addresses/:id", updateAddress);
router.delete("/addresses/:id", deleteAddress);

export default router;
