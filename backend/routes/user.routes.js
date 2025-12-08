import express from "express";
import { auth } from "../middlewares/auth.middleware.js";

import {
  getProfile,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  updateAvatar
} from "../controllers/user.controller.js";

const router = express.Router();

// PROFILE
router.get("/me", auth, getProfile);
router.put("/me", auth, updateProfile);

// UPDATE ONLY AVATAR
router.put("/me/avatar", auth, updateAvatar);

// ADDRESS
router.get("/addresses", auth, getAddresses);
router.post("/addresses", auth, addAddress);
router.put("/addresses/:id", auth, updateAddress);
router.delete("/addresses/:id", auth, deleteAddress);

export default router;
