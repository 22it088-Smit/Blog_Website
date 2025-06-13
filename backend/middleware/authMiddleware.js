const jwt = require("jsonwebtoken")
const User = require("../models/User")
const config = require("../config/config")

/**
 * Middleware to protect routes - verifies JWT token
 */
exports.protect = async (req, res, next) => {
  let token

  // Check if token exists in headers or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    // Get token from header
    token = req.headers.authorization.split(" ")[1]
  } else if (req.cookies.token) {
    // Get token from cookie
    token = req.cookies.token
  }

  // Check if token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret)

    // Get user from the token
    req.user = await User.findById(decoded.id).select("-password")

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found with this id",
      })
    }

    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    })
  }
}
