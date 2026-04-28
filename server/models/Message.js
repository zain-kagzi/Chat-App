const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    roomId: String,
    sender: String,
    text: String,
  },
  { timestamps: true } // createdAt automatically add hoga
);

// 🔥 TTL INDEX (7 days auto delete)
messageSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 }
);

module.exports = mongoose.model("Message", messageSchema);