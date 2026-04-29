const mongoose = require("mongoose");
const crypto = require("crypto");

// ✅ function to generate unique roomId
const generateRoomId = () => {
  return crypto.randomBytes(8).toString("hex");
};

const userSchema = new mongoose.Schema({
  username: String,

  email: { type: String, unique: true },

  password: String,

  profilePic: {
    type: String,
    default: null,
  },

  // ✅ NEW FIELD
  roomId: {
    type: String,
    unique: true,
    default: generateRoomId, // 🔥 auto generate
  },
});

module.exports = mongoose.model("User", userSchema);