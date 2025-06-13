const User = require("../models/User")
const Blog = require("../models/Blog")
const ApiResponse = require("../utils/apiResponse")

/**
 * @desc    Get all users (admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
exports.getUsers = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1
    const limit = Number.parseInt(req.query.limit, 10) || 10
    const startIndex = (page - 1) * limit

    const total = await User.countDocuments()
    const users = await User.find().select("-password").sort({ createdAt: -1 }).skip(startIndex).limit(limit)

    ApiResponse.pagination(res, "Users retrieved successfully", users, page, limit, total)
  } catch (error) {
    console.error(error)
    ApiResponse.error(res, "Server error", 500)
  }
}

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")

    if (!user) {
      return ApiResponse.error(res, "User not found", 404)
    }

    ApiResponse.success(res, "User retrieved successfully", user)
  } catch (error) {
    console.error(error)
    ApiResponse.error(res, "Server error", 500)
  }
}

/**
 * @desc    Delete user (admin only)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return ApiResponse.error(res, "User not found", 404)
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return ApiResponse.error(res, "Cannot delete your own account", 400)
    }

    await user.remove()

    ApiResponse.success(res, "User deleted successfully")
  } catch (error) {
    console.error(error)
    ApiResponse.error(res, "Server error", 500)
  }
}

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile/:id
 * @access  Public
 */
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password").populate("blogs")

    if (!user) {
      return ApiResponse.error(res, "User not found", 404)
    }

    // Get user's blogs
    const blogs = await Blog.find({ author: req.params.id }).sort({ createdAt: -1 }).limit(10)

    ApiResponse.success(res, "User profile retrieved successfully", {
      user,
      blogs,
    })
  } catch (error) {
    console.error(error)
    ApiResponse.error(res, "Server error", 500)
  }
}

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body

    // Handle avatar upload
    let avatar = req.user.avatar
    if (req.file) {
      avatar = req.file.filename
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio, avatar },
      { new: true, runValidators: true },
    ).select("-password")

    ApiResponse.success(res, "Profile updated successfully", user)
  } catch (error) {
    console.error(error)
    ApiResponse.error(res, "Server error", 500)
  }
}
