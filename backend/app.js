// app.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from "path";

// ROUTES
import uploadRoutes from "./routes/upload.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import userRoutes from "./routes/user.routes.js";
import deliveryRoutes from "./routes/delivery.routes.js";
import testimonialsRoutes from "./routes/testimonials.routes.js";

dotenv.config();

const app = express();

// --------- CORS FIX --------------
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}));

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// --------- STATIC UPLOADS ----------
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// --------- ROUTES ----------
app.use("/api/upload", uploadRoutes); // upload first
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/user", userRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/testimonials", testimonialsRoutes);

// TEST
app.get("/", (req, res) => {
  res.send("Backend Running Successfully 🚀");
});

export default app;
