import express from "express";
import { upload } from "../middleware/upload.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import User from "../models/User.js";

const router = express.Router();

router.put("/update-profile", upload.single("avatar"), async (req, res) => {
  try {
    const userId = req.user.id; // JWT se aayega
    const { name } = req.body;

    let updateData = {
      username: name,
    };

    // 👉 Upload image to cloudinary
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);

      updateData.avatar = result.secure_url; // 🔥 main cheez
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    );

    res.json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating profile" });
  }
});

export default router;