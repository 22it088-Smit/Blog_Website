const Comment = require("../models/Comment")

/**
 * Service class for comment related operations
 */
class CommentService {
  /**
   * Get comments by blog ID
   * @param {string} blogId - Blog ID
   * @returns {Array} - Comments
   */
  async getCommentsByBlog(blogId) {
    return await Comment.find({ blog: blogId, parent: null })
      .populate("user", "name avatar")
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: "name avatar",
        },
      })
      .sort({ createdAt: -1 })
  }

  /**
   * Get comment count by blog ID
   * @param {string} blogId - Blog ID
   * @returns {number} - Comment count
   */
  async getCommentCount(blogId) {
    return await Comment.countDocuments({ blog: blogId })
  }
}

module.exports = new CommentService()
