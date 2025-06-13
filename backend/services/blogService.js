const Blog = require("../models/Blog")
const User = require("../models/User")

/**
 * Service class for blog related operations
 */
class BlogService {
  /**
   * Get blogs by user ID
   * @param {string} userId - User ID
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Object} - Blogs and pagination info
   */
  async getBlogsByUser(userId, page = 1, limit = 10) {
    const startIndex = (page - 1) * limit

    const total = await Blog.countDocuments({ author: userId })
    const blogs = await Blog.find({ author: userId }).sort({ createdAt: -1 }).skip(startIndex).limit(limit)

    return {
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  /**
   * Get popular blogs
   * @param {number} limit - Number of blogs to return
   * @returns {Array} - Popular blogs
   */
  async getPopularBlogs(limit = 5) {
    return await Blog.find().sort({ viewCount: -1, likeCount: -1 }).limit(limit).populate("author", "name avatar")
  }

  /**
   * Get blog categories
   * @returns {Array} - Unique categories
   */
  async getCategories() {
    return await Blog.distinct("category")
  }

  /**
   * Get blog tags
   * @returns {Array} - Unique tags
   */
  async getTags() {
    return await Blog.distinct("tags")
  }
}

module.exports = new BlogService()
