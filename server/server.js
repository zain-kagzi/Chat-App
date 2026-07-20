const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// CORS - specific origins only
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(",") 
  : ["http://localhost:5173"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const userRoutes = require("./routes/user");

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/user", userRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
});

// MongoDB connection
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ DB connected");
  } catch (err) {
    console.error("❌ DB connection failed:", err);
    process.exit(1);
  }
};

connectDB();

// Socket.IO setup
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

const jwt = require("jsonwebtoken");
const Message = require("./models/Message");

// Socket authentication
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  
  if (!token) {
    return next(new Error("Authentication required"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Invalid or expired token"));
  }
});

// Track online users
const onlineUsers = new Map();

io.on("connection", (socket) => {
  const userId = socket.user?.userId?.toString();
  console.log(`✅ User connected: ${socket.id} | User: ${userId}`);

  if (userId) {
    onlineUsers.set(userId, socket.id);
    socket.broadcast.emit("userOnline", userId);
  }

  // Join room
  socket.on("joinPrivateRoom", ({ roomId }) => {
    if (roomId) socket.join(roomId);
  });

  // Leave room
  socket.on("leavePrivateRoom", ({ roomId }) => {
    if (roomId) socket.leave(roomId);
  });

  // Typing indicator
  socket.on("typing", ({ roomId, userId }) => {
    socket.to(roomId).emit("typing", { roomId, userId });
  });

  socket.on("stopTyping", ({ roomId, userId }) => {
    socket.to(roomId).emit("stopTyping", { roomId, userId });
  });

  // Send message
  socket.on("sendPrivateMessage", async ({ roomId, message }) => {
    try {
      if (!message?.text?.trim() || !roomId) {
        return socket.emit("error", { message: "Invalid message data" });
      }

      const savedMessage = await Message.create({
        roomId,
        sender: message.senderName,
        senderId: message.senderId,
        text: message.text.trim(),
        createdAt: new Date(),
        read: false,
        reactions: [],
        replyTo: message.replyTo || null,
      });

      io.to(roomId).emit("receivePrivateMessage", {
        _id: savedMessage._id,
        text: savedMessage.text,
        senderName: savedMessage.sender,
        senderId: savedMessage.senderId,
        roomId: savedMessage.roomId,
        createdAt: savedMessage.createdAt,
        read: savedMessage.read,
        reactions: savedMessage.reactions,
        replyTo: savedMessage.replyTo,
      });
    } catch (err) {
      console.error("❌ Send message error:", err);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Add reaction
  socket.on("addReaction", async ({ messageId, emoji, userId }) => {
    try {
      if (!messageId || !emoji || !userId) return;

      const message = await Message.findById(messageId);
      if (!message) return;

      const existingIndex = message.reactions.findIndex(
        (r) => r.userId === userId
      );

      if (existingIndex >= 0) {
        if (message.reactions[existingIndex].emoji === emoji) {
          message.reactions.splice(existingIndex, 1);
        } else {
          message.reactions[existingIndex].emoji = emoji;
        }
      } else {
        message.reactions.push({ emoji, userId, createdAt: new Date() });
      }

      await message.save();

      io.to(message.roomId).emit("messageReaction", {
        messageId,
        reactions: message.reactions,
      });
    } catch (err) {
      console.error("❌ Reaction error:", err);
    }
  });

  // Mark as read
  socket.on("markAsRead", async ({ roomId, userId }) => {
    try {
      if (!roomId || !userId) return;

      await Message.updateMany(
        { roomId, senderId: { $ne: userId }, read: false },
        { $set: { read: true } }
      );

      io.to(roomId).emit("messagesRead", { roomId, userId });
    } catch (err) {
      console.error("❌ Mark read error:", err);
    }
  });

  // Delete message
  socket.on("deleteMessage", async ({ messageId, roomId }) => {
    try {
      const msg = await Message.findById(messageId);
      if (!msg) return;

      if (msg.senderId !== userId) {
        return socket.emit("error", { message: "Unauthorized" });
      }

      await Message.findByIdAndDelete(messageId);
      io.to(roomId).emit("messageDeleted", { messageId });
    } catch (err) {
      console.error("❌ Delete error:", err);
    }
  });

  // Disconnect
  socket.on("disconnect", (reason) => {
    console.log(`❌ User disconnected: ${socket.id} | Reason: ${reason}`);
    
    if (userId) {
      onlineUsers.delete(userId);
      socket.broadcast.emit("userOffline", userId);
    }
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("\nSIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("✅ HTTP server closed");
    mongoose.connection.close(false, () => {
      console.log("✅ DB connection closed");
      process.exit(0);
    });
  });
  setTimeout(() => {
    console.error("❌ Forced shutdown");
    process.exit(1);
  }, 10000);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
});