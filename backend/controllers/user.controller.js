import User from "../models/User.js";
import Address from "../models/Address.js";

// GET /api/user/me (auth middleware se bhi hai)
export const getProfile = async (req, res) => {
  try {
    return res.status(200).json({ user: req.currentUser });
  } catch (err) {
    console.error("getProfile error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/user/me
export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone },
      { new: true }
    ).select("-password");

    return res.status(200).json({ message: "Profile updated", user });
  } catch (err) {
    console.error("updateProfile error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ============ Address ============ //

// GET /api/user/addresses
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user.id });
    return res.status(200).json({ addresses });
  } catch (err) {
    console.error("getAddresses error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/user/addresses
export const addAddress = async (req, res) => {
  try {
    const { label, fullAddress, pincode, city, state, coords } = req.body;

    const address = await Address.create({
      userId: req.user.id,
      label,
      fullAddress,
      pincode,
      city,
      state,
      coords,
    });

    return res
      .status(201)
      .json({ message: "Address added", address });
  } catch (err) {
    console.error("addAddress error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/user/addresses/:id
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!address)
      return res.status(404).json({ message: "Address not found" });

    return res
      .status(200)
      .json({ message: "Address updated", address });
  } catch (err) {
    console.error("updateAddress error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/user/addresses/:id
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!address)
      return res.status(404).json({ message: "Address not found" });

    return res.status(200).json({ message: "Address deleted" });
  } catch (err) {
    console.error("deleteAddress error", err);
    return res.status(500).json({ message: "Server error" });
  }
};
