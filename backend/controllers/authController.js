const User = require("../models/User")
const ApiResponse = require("../utils/apiResponse")
const authService = require("../services/authService")

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return ApiResponse.error(res, "Email already in use", 400)
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    })

    // Generate token and send response
    authService.sendTokenResponse(user, 201, res, "User registered successfully")
  } catch (error) {
    console.error(error)
    ApiResponse.error(res, "Server error", 500)
  }
}

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Check if user exists
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return ApiResponse.error(res, "Invalid credentials", 401)
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return ApiResponse.error(res, "Invalid credentials", 401)
    }

    // Generate token and send response
    authService.sendTokenResponse(user, 200, res, "Login successful")
  } catch (error) {
    console.error(error)
    ApiResponse.error(res, "Server error", 500)
  }
}

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    ApiResponse.success(res, "User data retrieved", user)
  } catch (error) {
    console.error(error)
    ApiResponse.error(res, "Server error", 500)
  }
}

/**
 * @desc    Logout user / clear cookie
 * @route   GET /api/auth/logout
 * @access  Private
 */
exports.logout = (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  })

  ApiResponse.success(res, "User logged out successfully")
}
