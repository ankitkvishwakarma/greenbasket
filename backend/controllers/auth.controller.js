import bcrypt from "bcrypt";
import crypto from "crypto";
import { validationResult } from "express-validator";

import User from "../models/User.js";
import Token from "../models/Token.js";
import { generateAccessToken } from "../utils/generateJwt.js";
import { sendEmail } from "../config/sendEmail.js";

// helper: create token doc
const createToken = async (userId, type, minutesValid) => {
  const tokenString = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + minutesValid * 60 * 1000);

  await Token.create({
    userId,
    token: tokenString,
    type,
    expiresAt,
  });

  return tokenString;
};

// POST /api/auth/signup
export const register = async (req, res) => {
  try {
    // validation errors handle
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation error", errors: errors.array() });
    }

    const { name, email, password, phone } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashed,
      role: "USER",
    });

    // create email verify token (valid 24 hours)
    const token = await createToken(user._id, "EMAIL_VERIFY", 24 * 60);

    const verifyLink = `${process.env.API_BASE_URL}/api/auth/verify-email?token=${token}`;

    await sendEmail({
      to: user.email,
      subject: "Verify your email - Green Basket",
      html: `
        <h2>Verify your email</h2>
        <p>Hi ${user.name},</p>
        <p>Please click the link below to verify your email:</p>
        <a href="${verifyLink}" target="_blank">${verifyLink}</a>
        <p>This link is valid for 24 hours.</p>
      `,
    });

    return res.status(201).json({
      message: "User registered. Verification email sent.",
    });
  } catch (err) {
    console.error("register error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/auth/verify-email?token=...
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Token missing" });
    }

    const tokenDoc = await Token.findOne({
      token,
      type: "EMAIL_VERIFY",
      expiresAt: { $gt: new Date() },
    });

    if (!tokenDoc) {
      return res.status(400).json({ message: "Token invalid or expired" });
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(200).json({ message: "Email already verified" });
    }

    user.isEmailVerified = true;
    await user.save();

    // token remove
    await Token.deleteMany({ userId: user._id, type: "EMAIL_VERIFY" });

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error("verifyEmail error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/resend-verification
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(200).json({ message: "Email already verified" });
    }

    // purane tokens delete
    await Token.deleteMany({ userId: user._id, type: "EMAIL_VERIFY" });

    const token = await createToken(user._id, "EMAIL_VERIFY", 24 * 60);
    const verifyLink = `${process.env.API_BASE_URL}/api/auth/verify-email?token=${token}`;

    await sendEmail({
      to: user.email,
      subject: "Resend verification - Green Basket",
      html: `
        <h2>Verify your email</h2>
        <p>Hi ${user.name},</p>
        <p>Please click the link below to verify your email:</p>
        <a href="${verifyLink}" target="_blank">${verifyLink}</a>
      `,
    });

    return res.status(200).json({ message: "Verification email resent" });
  } catch (err) {
    console.error("resendVerification error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Validation error", errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: "Please verify your email before login" });
    }

    const accessToken = generateAccessToken(user);

    return res.status(200).json({
      message: "Login successful",
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("login error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // security: don't expose existence
      return res.status(200).json({ message: "If that email exists, reset link sent" });
    }

    await Token.deleteMany({ userId: user._id, type: "PASSWORD_RESET" });

    const token = await createToken(user._id, "PASSWORD_RESET", 60); // 60 min
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    await sendEmail({
      to: user.email,
      subject: "Reset your password - Green Basket",
      html: `
        <h2>Reset Password</h2>
        <p>Hi ${user.name},</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" target="_blank">${resetLink}</a>
        <p>This link is valid for 1 hour.</p>
      `,
    });

    return res.status(200).json({
      message: "If that email exists, reset link has been sent",
    });
  } catch (err) {
    console.error("forgotPassword error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and password required" });
    }

    const tokenDoc = await Token.findOne({
      token,
      type: "PASSWORD_RESET",
      expiresAt: { $gt: new Date() },
    });

    if (!tokenDoc) {
      return res.status(400).json({ message: "Token invalid or expired" });
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    await user.save();

    await Token.deleteMany({ userId: user._id, type: "PASSWORD_RESET" });

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("resetPassword error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = req.currentUser; // from auth middleware
    return res.status(200).json({ user });
  } catch (err) {
    console.error("getMe error", err);
    return res.status(500).json({ message: "Server error" });
  }
};
