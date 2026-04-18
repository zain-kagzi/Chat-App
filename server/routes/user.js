const express = require("express");
const router = express.Router();
const User = require("../models/User");
const multer = require("multer");
const { authMiddleware } = require("../middleware/auth");

// ✅ MULTER CONFIG
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ UPDATE PROFILE ROUTE
router.put(
  "/update-profile",
  authMiddleware,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      const userId = req.user.userId;

      const updateData = {
        username: req.body.username,
      };

      if (req.file) {
        updateData.profilePic = req.file.filename;
      }

      const user = await User.findByIdAndUpdate(userId, updateData, {
        new: true,
      });

      res.json({ user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Update failed" });
    }
  }
);

module.exports = router;