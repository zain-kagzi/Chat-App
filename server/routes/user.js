const express = require("express");
const router = express.Router();
const User = require("../models/User");
const multer = require("multer");
const upload = require("../middleware/upload");
const { authMiddleware } = require("../middleware/auth");
const cloudinary = require("../config/cloudinary");

// ✅ UPDATE PROFILE ROUTE
router.put(
  "/update-profile",
  authMiddleware,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const userId = req.user.userId;

      let updateData = {};

      if (req.body.username) {
        updateData.username = req.body.username;
      }

      // ✅ upload to cloudinary (same as register)
      if (req.file) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "chat-app-profiles" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          );
          stream.end(req.file.buffer);
        });

        updateData.profilePic = result.secure_url;
      }

      const user = await User.findByIdAndUpdate(userId, updateData, {
        returnDocument: "after",
      }).select("-password");

      res.json({ user });
    } catch (err) {
      console.error("UPDATE ERROR:", err);
      res.status(500).json({ message: "Update failed" });
    }
  },
);
module.exports = router;
