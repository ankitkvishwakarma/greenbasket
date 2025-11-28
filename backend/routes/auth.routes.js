import express from "express";
import { body } from "express-validator";

import {
  register,
  verifyEmail,
  resendVerification,
  login,
  forgotPassword,
  resetPassword,
  getMe,
} from "../controllers/auth.controller.js";

import { auth } from "../middlewares/auth.middleware.js";

const router = express.Router();

// signup
router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Min 6 char password"),
  ],
  register
);

// login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  login
);
router.get("/test-email", async (req, res) => {
  const ok = await sendEmail({
    to: "ankit789.en@gmail.com",
    subject: "Test Email",
    html: "<h1>Mail Working ✔</h1>"
  });

  res.json({ mail: ok });
  });


  // email verify (link GET)
  router.get("/verify-email", verifyEmail);

  // resend verification
  router.post("/resend-verification", resendVerification);

  // forgot password
  router.post("/forgot-password", forgotPassword);

  // reset password
  router.post(
    "/reset-password",
    [
      body("password").isLength({ min: 6 }).withMessage("Min 6 char password"),
    ],
    resetPassword
  );

  // current user
  router.get("/me", auth, getMe);

  export default router;
