import dotenv from "dotenv";
dotenv.config(); 

import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// ================= SOCKET.IO ================= //
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  },
});

// Make io available in routes/controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ================= SOCKET EVENTS ================= //
io.on("connection", (socket) => {
  console.log("⚡ Delivery Socket Connected:", socket.id);

  // Delivery Boy join room
  socket.on("track-me", (deliveryId) => {
    socket.join(`delivery-${deliveryId}`);
    console.log(`🚗 Delivery Joined Room delivery-${deliveryId}`);
  });

  // Delivery sends live location
  socket.on("send-location", (data) => {
    // data => {orderId, lat, lng}
    io.to(`order-${data.orderId}`).emit("live-location", data);
    console.log("📍 Live Location Update:", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket Disconnected:", socket.id);
  });
});


// ================= START SERVER ================= //
const start = async () => {
  await connectDB();
  server.listen(PORT, () =>
    console.log(`🚀 Server Running at http://localhost:${PORT}`)
  );
};

start();
