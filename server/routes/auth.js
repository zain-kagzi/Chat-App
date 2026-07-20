const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");
const { body, validationResult } = require("express-validator");

const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = 12;

const DEFAULT_PROFILE = "https://ui-avatars.com/api/?name=User&background=random&color=fff";

// Validation rules
const registerValidation = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be 3-30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, underscores"),
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
  body("email").trim().isEmail().normalizeEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password required"),
];

// REGISTER
router.post("/register", registerValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => e.msg),
    });
  }

  upload.single("profilePic")(req, res, async (err) => {
    try {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            success: false,
            message: "Image too large (max 2MB)",
          });
        }
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      const { username, email, password } = req.body;

      const existingUser = await User.findOne({
        $or: [{ email: email.toLowerCase() }, { username: username.toLowerCase() }],
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: existingUser.email === email.toLowerCase()
            ? "Email already registered"
            : "Username already taken",
        });
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const roomId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      let profilePic = DEFAULT_PROFILE;

      if (req.file) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "chat-app-profiles",
              transformation: [
                { width: 400, height: 400, crop: "fill" },
                { quality: "auto" },
              ],
            },
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
        username: username.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        profilePic,
        roomId,
      });

      await user.save();

      const token = jwt.sign(
        { userId: user._id, username: user.username },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          profilePic: user.profilePic,
          roomId: user.roomId,
        },
      });
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      res.status(500).json({
        success: false,
        message: "Registration failed. Please try again.",
      });
    }
  });
});

// LOGIN
router.post("/login", loginValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((e) => e.msg),
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    user.lastSeen = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        roomId: user.roomId,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
});

// GET USERS
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password -__v").lean();
    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (err) {
    console.error("FETCH USERS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
});

module.exports = router;