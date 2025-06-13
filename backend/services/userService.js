const User = require("../models/User")
const Blog = require("../models/Blog")

/**
 * Service class for user related operations
 */
class UserService {
  /**
   * Get user stats
   * @param {string} userId - User ID
   * @returns {Object} - User stats
   */
  async getUserStats(userId) {
    const blogCount = await Blog.countDocuments({ author: userId })
    const likeCount = await Blog.aggregate([
      { $match: { author: userId } },
      { $project: { likeCount: { $size: "$likes" } } },
      { $group: { _id: null, total: { $sum: "$likeCount" } } },
    ])

    const viewCount = await Blog.aggregate([
      { $match: { author: userId } },
      { $group: { _id: null, total: { $sum: "$viewCount" } } },
    ])

    return {
      blogCount,
      likeCount: likeCount.length > 0 ? likeCount[0].total : 0,
      viewCount: viewCount.length > 0 ? viewCount[0].total : 0,
    }
  }

  /**
   * Get top users by blog count
   * @param {number} limit - Number of users to return
   * @returns {Array} - Top users
   */
  async getTopUsers(limit = 5) {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "blogs",
          localField: "_id",
          foreignField: "author",
          as: "blogs",
        },
      },
      {
        $project: {
          name: 1,
          avatar: 1,
          blogCount: { $size: "$blogs" },
        },
      },
      { $sort: { blogCount: -1 } },
      { $limit: limit },
    ])

    return users
  }
}

module.exports = new UserService()
