// import { upload } from "../middleware/upload.js";
// import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
// import User from "../models/User.js";
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");

router.put("/update-profile", async (req, res) => {
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

// Get user loggedin 

router.get("/loggedInUser",async(req,res)=>{
  try {
    const users = await User
    console.log(users)
    res.json(users)

  } catch (error) {
    console.log(err);
    res.status(500).json({ message: "Error updating profile" });
  }
})

module.exports = router;