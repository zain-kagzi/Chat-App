const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const User = require("../models/User"); // ✅ Add this
const { authMiddleware } = require("../middleware/auth");

// GET messages by room (Protected + Paginated)
router.get("/:roomId", authMiddleware, async (req, res) => {
  try {
    const { roomId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const skip = (page - 1) * limit;

    if (!roomId || !roomId.includes("_")) {
      return res.status(400).json({
        success: false,
        message: "Invalid room ID format",
      });
    }

    // ✅ FIX: Get current user's roomId from DB
    const currentUser = await User.findById(req.user.userId);
    
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const roomIds = roomId.split("_");
    const userRoomId = currentUser.roomId;

    // ✅ Check if user's roomId is part of this room
    if (!roomIds.includes(userRoomId)) {
      return res.status(403).json({
        success: false,
        message: "Access denied to this room",
      });
    }

    const [messages, total] = await Promise.all([
      Message.find({ roomId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Message.countDocuments({ roomId }),
    ]);

    res.json({
      success: true,
      data: messages.reverse(),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: skip + messages.length < total,
      },
    });
  } catch (err) {
    console.error("FETCH MESSAGES ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
});

// DELETE message
router.delete("/:messageId", authMiddleware, async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.userId;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    if (message.senderId !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own messages",
      });
    }

    await Message.findByIdAndDelete(messageId);

    res.json({
      success: true,
      message: "Message deleted",
      deletedId: messageId,
    });
  } catch (err) {
    console.error("DELETE MESSAGE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete message",
    });
  }
});

module.exports = router;