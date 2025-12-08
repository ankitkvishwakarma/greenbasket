import User from "../models/User.js";
import Address from "../models/Address.js";
import cloudinary from "../utils/cloudinary.js";
import streamifier from "streamifier";

// Helper to get logged user ID safely
const getUserIdFromReq = (req) => {
  if (req.currentUser?._id) return req.currentUser._id;
  if (req.user?.id) return req.user.id;
  return null;
};

/* ======================================================
   Cloudinary Upload Helper (BUFFER SUPPORT)
====================================================== */
const uploadBufferToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

/* ======================================================
   GET PROFILE
====================================================== */
export const getProfile = async (req, res) => {
  try {
    return res.status(200).json({ user: req.currentUser });
  } catch (err) {
    console.error("getProfile error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   UPDATE PROFILE (NAME, PHONE) — avatar नहीं
====================================================== */
export const updateProfile = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { name, phone } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;

    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true }
    ).select("-password");

    return res.status(200).json({ message: "Profile updated", user });
  } catch (err) {
    console.error("updateProfile error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   UPDATE AVATAR (ONLY IMAGE UPDATE)
====================================================== */
export const updateAvatar = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // no file provided
    if (!req.files || !req.files.avatar) {
      return res.status(400).json({ message: "Avatar missing" });
    }

    const file = req.files.avatar;
    const imageUrl = await uploadBufferToCloudinary(file.data, "greenbasket/avatars");

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: imageUrl },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      message: "Avatar updated",
      avatar: updatedUser.avatar,
      user: updatedUser,
    });

  } catch (err) {
    console.error("updateAvatar error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   ADDRESS SECTION (ADD / UPDATE / DELETE / GET)
====================================================== */

export const getAddresses = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    const addresses = await Address.find({ userId });
    return res.status(200).json({ addresses });
  } catch (err) {
    console.error("getAddresses error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const addAddress = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    const address = await Address.create({ userId, ...req.body });

    return res.status(201).json({
      message: "Address added",
      address,
    });
  } catch (err) {
    console.error("addAddress error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    const { id } = req.params;

    const address = await Address.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true }
    );

    if (!address)
      return res.status(404).json({ message: "Address not found" });

    return res.status(200).json({ message: "Address updated", address });
  } catch (err) {
    console.error("updateAddress error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    const { id } = req.params;

    const address = await Address.findOneAndDelete({ _id: id, userId });

    if (!address)
      return res.status(404).json({ message: "Address not found" });

    return res.status(200).json({ message: "Address deleted" });
  } catch (err) {
    console.error("deleteAddress error", err);
    return res.status(500).json({ message: "Server error" });
  }
};
