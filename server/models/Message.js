const mongoose = require("mongoose");

const reactionSchema = new mongoose.Schema({
  emoji: { type: String, required: true },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const replySchema = new mongoose.Schema({
  messageId: { type: String, required: true },
  text: { type: String, required: true },
  senderName: { type: String, required: true },
});

const messageSchema = new mongoose.Schema({
  roomId: { type: String, required: true, index: true },
  sender: { type: String, required: true },
  senderId: { type: String, required: true, index: true },
  text: { type: String, required: true, maxlength: 2000 },
  createdAt: { type: Date, default: Date.now, index: true },
  read: { type: Boolean, default: false },
  reactions: [reactionSchema],
  replyTo: replySchema,
});

// Compound index for fast queries
messageSchema.index({ roomId: 1, createdAt: -1 });

module.exports = mongoose.model("Message", messageSchema);