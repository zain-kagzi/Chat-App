const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// ✅ Routes
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ✅ MongoDB
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

// ✅ Socket setup
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: { origin: "*" },
});

const jwt = require("jsonwebtoken");

// ✅ Socket Authentication
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) return next(new Error("No token"));

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

// ✅ Message Model
const Message = require("./models/Message");

// ✅ Socket Logic
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ✅ Join private room
  socket.on("joinPrivateRoom", ({ roomId }) => {
    socket.join(roomId);
  });

  // ✅ Send message (DB + realtime)
  socket.on("sendPrivateMessage", async ({ roomId, message }) => {
    try {
      // 🔥 SAVE TO DB
      await Message.create({
        roomId,
        sender: message.senderName,
        text: message.text,
      });

      // 🔥 SEND TO OTHER USER ONLY (no duplicate)
      io.to(roomId).emit("receivePrivateMessage", {
        ...message,
        roomId, // ✅ add this
      });
    } catch (err) {
      console.log(err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// ✅ Start server
server.listen(process.env.PORT, () => {
  console.log("Server running on port 5000");
});
