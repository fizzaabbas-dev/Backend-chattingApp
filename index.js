import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

app.use(
  cors({
    origin: "https://chatting-app-frontend-gicwlh4km-fizza123.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: "https://chatting-app-frontend-gicwlh4km-fizza123.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send("<h1>Hello from Realtime Socket Chat Server</h1>");
});




io.on("connection", (socket) => {
  console.log("User connected:", socket.id);


  
  socket.on("join", ({ room, username }) => {
    socket.join(room);

    socket.username = username;
    socket.room = room;

    console.log(`${username} joined ${room}`);

    // Get users in this room
    const roomUsers = [];

    const socketsInRoom = io.sockets.adapter.rooms.get(room);

    if (socketsInRoom) {
      socketsInRoom.forEach((socketId) => {
        const userSocket = io.sockets.sockets.get(socketId);

        if (userSocket?.username) {
          roomUsers.push({
            username: userSocket.username,
            id: socketId,
          });
        }
      });
    }

    // Send online users to everyone in room
    io.to(room).emit("onlineUsers", roomUsers);
  });


  /* =========================
     SEND MESSAGE
  ========================= */

  socket.on("send", (message) => {
    console.log("Message:", message);

    io.to(message.room).emit("message", message);
  });


  /* =========================
     DISCONNECT
  ========================= */

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    if (socket.room) {
      const room = socket.room;

      const roomUsers = [];

      const socketsInRoom =
        io.sockets.adapter.rooms.get(room);

      if (socketsInRoom) {
        socketsInRoom.forEach((socketId) => {
          const userSocket =
            io.sockets.sockets.get(socketId);

          if (userSocket?.username) {
            roomUsers.push({
              username: userSocket.username,
              id: socketId,
            });
          }
        });
      }

      io.to(room).emit(
        "onlineUsers",
        roomUsers
      );
    }
  });
});


const PORT = process.env.PORT || 5050;


server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
})