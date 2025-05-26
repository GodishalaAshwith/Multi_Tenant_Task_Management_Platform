const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

module.exports = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1]; // Extract token

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch complete user data including organization
    const user = await User.findById(decoded.userId)
      .select("-password")
      .populate("organization", "name");

    if (!user || !user.isActive) {
      return res.status(401).json({ msg: "User not found or inactive" });
    }

    // Attach complete user info to request
    req.user = user;
    req.organizationId = user.organization._id;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};
