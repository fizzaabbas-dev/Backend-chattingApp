import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://chatting-app-frontend-bjlgbqa6t-fizza123.vercel.app",
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

  // Join a room (Handling both string or object if passed from frontend)
  socket.on("join", (data) => {
    const roomName = typeof data === "object" ? data.room : data;
    socket.join(roomName);
    console.log(`User joined room: ${roomName}`);
  });

  socket.on("leave", (roomName) => {
    socket.leave(roomName);
    console.log(`User left room: ${roomName}`);
  });

  // Broadcast message to everyone in the room (including sender if needed, or use socket.to)
  socket.on("send", (message) => {
    console.log("Message received:", message);
    // io.to ensures everyone in the room gets the message
    io.to(message.room).emit("message", message);
  });
});

const PORT = process.env.PORT || 5050;
server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});