const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,  // ← This creates index automatically
    trim: true, 
    minlength: 3, 
    maxlength: 30 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,  // ← This creates index automatically
    trim: true, 
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 6 
  },
  profilePic: { 
    type: String, 
    default: "" 
  },
  roomId: { 
    type: String, 
    required: true, 
    unique: true  // ← This creates index automatically
  },
  isOnline: { 
    type: Boolean, 
    default: false 
  },
  lastSeen: { 
    type: Date, 
    default: Date.now 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});


module.exports = mongoose.model("User", userSchema);