const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ❌ no header
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // ✅ "Bearer TOKEN" → TOKEN nikaalo
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");

    // 👉 decoded = { userId, username }
    req.user = decoded;

    next();
  } catch (err) {
    console.error("JWT ERROR:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { authMiddleware };