import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: " http://chatting-app-frontend-one.vercel.app",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("join", (roomId) => {
    socket.join(roomId);
  });

  socket.on("leave", (roomId) => {
    socket.leave(roomId);
  });

  // Broadcast message to everyone in the specific room
  socket.on("send", (message) => {
    console.log("Message received:", message);
    io.to(message.room).emit("message", message);
  });
});


server.listen(5050, () => {
  console.log("Server running on port:5050");
});