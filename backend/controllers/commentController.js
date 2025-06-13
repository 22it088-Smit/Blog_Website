const Comment = require("../models/Comment")
const Blog = require("../models/Blog")
const ApiResponse = require("../utils/apiResponse")

/**
 * @desc    Add comment to blog
 * @route   POST /api/blogs/:blogId/comments
 * @access  Private
 */
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body
    const { blogId } = req.params
    const parentId = req.body.parentId || null

    // Check if blog exists
    const blog = await Blog.findById(blogId)
    if (!blog) {
      return ApiResponse.error(res, "Blog not found", 404)
    }

    // Check if parent comment exists if provided
    if (parentId) {
      const parentComment = await Comment.findById(parentId)
      if (!parentComment) {
        return ApiResponse.error(res, "Parent comment not found", 404)
      }
    }

    // Create comment
    const comment = await Comment.create({
      content,
      blog: blogId,
      user: req.user.id,
      parent: parentId,
    })

    // Populate user data
    await comment.populate("user", "name avatar")

    ApiResponse.success(res, "Comment added successfully", comment, 201)
  } catch (error) {
    console.error(error)
    ApiResponse.error(res, "Server error", 500)
  }
}

/**
 * @desc    Get comments for a blog
 * @route   GET /api/blogs/:blogId/comments
 * @access  Public
 */
exports.getComments = async (req, res) => {
  try {
    const { blogId } = req.params

    // Check if blog exists
    const blog = await Blog.findById(blogId)
    if (!blog) {
      return ApiResponse.error(res, "Blog not found", 404)
    }

    // Get top-level comments (no parent)
    const comments = await Comment.find({ blog: blogId, parent: null })
      .populate("user", "name avatar")
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: "name avatar",
        },
      })
      .sort({ createdAt: -1 })

    ApiResponse.success(res, "Comments retrieved successfully", comments)
  } catch (error) {
    console.error(error)
    ApiResponse.error(res, "Server error", 500)
  }
}

/**
 * @desc    Delete comment
 * @route   DELETE /api/comments/:id
 * @access  Private
 */
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)

    if (!comment) {
      return ApiResponse.error(res, "Comment not found", 404)
    }

    // Check if user is comment author or admin
    if (comment.user.toString() !== req.user.id && req.user.role !== "admin") {
      return ApiResponse.error(res, "Not authorized to delete this comment", 403)
    }

    await comment.remove()

    ApiResponse.success(res, "Comment deleted successfully")
  } catch (error) {
    console.error(error)
    ApiResponse.error(res, "Server error", 500)
  }
}
