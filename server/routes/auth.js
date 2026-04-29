const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");

// ✅ DEFAULT IMAGE
const DEFAULT_PROFILE =
  "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg";

// ✅ REGISTER
router.post("/register", (req, res) => {
  upload.single("profilePic")(req, res, async (err) => {
    try {
      // ✅ HANDLE MULTER ERROR FIRST
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "Image too large (max 2MB)",
          });
        }

        return res.status(400).json({
          message: err.message,
        });
      }

      const { username, email, password } = req.body;
      

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      let profilePic = "https://i.pravatar.cc/150";


      // ✅ Cloudinary upload
      if (req.file) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "chat-app-profiles" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });

        profilePic = result.secure_url;
      }
      

      const user = new User({
        username,
        email,
        password: hashedPassword,
        profilePic,
      });

      await user.save();

      res.json({ message: "User registered successfully", user });
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
});


// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      "SECRET_KEY",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user, // ✅ better: full user send karo
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET USERS
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

module.exports = router;