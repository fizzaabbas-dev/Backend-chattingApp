import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      
      "https://chatting-app-frontend-one.vercel.app" 
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.get("/", (req, res) => {
  res.send("<h1>Hello from Realtime Socket Chat Server</h1>");
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  // Join a room
  socket.on("join", (data) => {
    const roomName = typeof data === "object" ? data.room : data;
    socket.join(roomName);
    console.log(`User joined room: ${roomName}`);
  });

  socket.on("leave", (roomName) => {
    socket.leave(roomName);
    console.log(`User left room: ${roomName}`);
  });

  // Broadcast to room
  socket.on("send", (message) => {
    console.log("Message received:", message);
    io.to(message.room).emit("message", message);
  });
});

const PORT = process.env.PORT || 5050;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`listening on port ${PORT}`);
});