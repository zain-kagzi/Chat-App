const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   username: String,
//   email: String,
//   password: String
// });

// module.exports = mongoose.model("User", userSchema);

// models/User.js

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  profilePic: {
  type: String,
  default: null,
},
});



module.exports = mongoose.model("User", userSchema);