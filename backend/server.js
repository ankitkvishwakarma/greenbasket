// server.js
import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

// ================== HTTP SERVER ==================
const server = http.createServer(app);

// ================== SOCKET.IO ==================
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
  }
});

// Make io available to all routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ================== SOCKET EVENTS ==================
io.on("connection", (socket) => {
  console.log("⚡ Delivery Socket Connected:", socket.id);

  // Delivery Boy joins private room
  socket.on("track-me", (deliveryId) => {
    socket.join(`delivery-${deliveryId}`);
    console.log(`🚗 Delivery Joined Room: delivery-${deliveryId}`);
  });

  // Delivery Boy sends LIVE location
  socket.on("send-location", (data) => {
    // data = { orderId, lat, lng }
    io.to(`order-${data.orderId}`).emit("live-location", data);
    console.log("📍 Live Location Update:", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket Disconnected:", socket.id);
  });
});

// ================== START SERVER ==================
const start = async () => {
  try {
    await connectDB();
    server.listen(PORT, () =>
      console.log(`🚀 Server is running on http://localhost:${PORT}`)
    );
  } catch (error) {
    console.error("❌ Server startup error:", error);
    process.exit(1);
  }
};

start();
