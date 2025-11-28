import dotenv from "dotenv";
dotenv.config();  // REQUIRED HERE 🔥

import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  }
});

io.on("connection", ()=> console.log("Socket Connected") );

const start = async () => {
  await connectDB();
  server.listen(PORT, () => console.log(`Server running on ${PORT}`));
};

start();
