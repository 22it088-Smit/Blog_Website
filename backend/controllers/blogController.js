const Blog = require("../models/Blog")
const User = require("../models/User")
const ApiResponse = require("../utils/apiResponse")
const blogService = require("../services/blogService")
const exportService = require("../services/exportService")

/**
 * @desc    Get all blogs with pagination
 * @route   GET /api/blogs
 * @access  Public
 */
exports.getBlogs = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1
    const limit = Number.parseInt(req.query.limit, 10) || 10
    const startIndex = (page - 1) * limit
    const search = req.query.search || ""
    const category = req.query.category || ""
    const tag = req.query.tag || ""

    // Build query
    const query = {}

    // Search functionality
    if (search) {
      query.$text = { $search: search }
    }

    // Category filter
    if (category) {
      query.category = category
    }

    // Tag filter
    if (tag) {
      query.tags = tag
    }

    // Execute query with pagination
    const total = await Blog.countDocuments(query)
    const blogs = await Blog.find(query)
      .populate("author", "name avatar")
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)

    ApiResponse.pagination(res, "Blogs retrieved successfully", blogs, page, limit, total)
  } catch (error) {
    console.error(error)
    ApiResponse.error(res, "Server error", 500)
  }
}

/**
 * @desc    Get single blog by ID
 * @route   GET /api/blogs/:id
 * @access  Public
 */
exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate("author", "name avatar bio")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "name avatar",
        },
      })

    if (!blog) {
      return ApiResponse.error(res, "Blog not found", 404)
    }

    // Increment view count
    blog.viewCount += 1
    await blog.save()

    ApiResponse.success(res, "Blog retrieved successfully", blog)
  } catch (error) {
    console.error(error)
    ApiResponse.error(res, "Server error", 500)
  }
}

/**
 * @desc    Create new blog
 * @route   POST /api/blogs
 * @access  Private
 */
exports.createBlog = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body

    // Handle file upload
    let coverImage = "default-blog.jpg"
    if (req.file) {
      coverImage = req.file.filename
    }

    // Create blog
    const blog = await Blog.create({
      title,
      content,
      category,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      coverImage,
      author: req.user.id,
    })

    ApiResponse.success(res, "Blog created successfully", blog, 201)
  } catch (error) {
    console.error(error)
    ApiResponse.error(res, "Server error", 500)
  }
}

/**
 * @desc    Update blog
 * @route   PUT /api/blogs/:id
 * @access  Private
 */
exports.updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id)

    if (!blog) {
      return ApiResponse.error(res, "Blog not found", 404)
    }

    // Check if user is blog author or admin
    if (blog.author.toString() !== req.user.id && req.user.role !== "admin") {
      return ApiResponse.error(res, "Not authorized to update this blog", 403)
    }

    // Handle file upload
    if (req.file) {
      req.body.coverImage = req.file.filename
    }

    // Handle tags
    if (req.body.tags) {
      req.body.tags = req.body.tags.split(",").map((tag) => tag.trim())
    }

    // Update blog
    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    ApiResponse.success(res, "Blog updated successfully", blog)
  } catch (error) {
    console.error(error)
    ApiResponse.error(res, "Server error", 500)
  }
}

/**
 * @desc    Delete blog
 * @route   DELETE /api/blogs/:id
 * @access  Private
 */
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return ApiResponse.error(res, "Blog not found", 404)
    }

    // Check if user is blog author or admin
    if (blog.author.toString() !== req.user.id && req.user.role !== "admin") {
      return ApiResponse.error(res, "Not authorized to delete this blog", 403)
    }

    await blog.deleteOne()

    ApiResponse.success(res, "Blog deleted successfully")
  } catch (error) {
    console.error(error)
    ApiResponse.error(res, "Server error", 500)
  }
}

/**
 * @desc    Like/Unlike blog
 * @route   PUT /api/blogs/:id/like
 * @access  Private
 */
exports.likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return ApiResponse.error(res, "Blog not found", 404)
    }

    // Check if blog already liked
    const isLiked = blog.likes.includes(req.user.id)
    const isDisliked = blog.dislikes.includes(req.user.id)

    // Handle like/unlike logic
    if (isLiked) {
      // Unlike
      blog.likes = blog.likes.filter((like) => like.toString() !== req.user.id)
    } else {
      // Like
      blog.likes.push(req.user.id)

      // Remove from dislikes if present
      if (isDisliked) {
        blog.dislikes = blog.dislikes.filter((dislike) => dislike.toString() !== req.user.id)
      }
    }

    await blog.save()

    ApiResponse.success(res, isLiked ? "Blog unliked" : "Blog liked", {
      likes: blog.likes.length,
      dislikes: blog.dislikes.length,
      isLiked: !isLiked,
      isDisliked: false,
    })
  } catch (error) {
    console.error(error)
    ApiResponse.error(res, "Server error", 500)
  }
}

/**
 * @desc    Dislike/Undislike blog
 * @route   PUT /api/blogs/:id/dislike
 * @access  Private
 */
exports.dislikeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return ApiResponse.error(res, "Blog not found", 404)
    }

    // Check if blog already disliked
    const isDisliked = blog.dislikes.includes(req.user.id)
    const isLiked = blog.likes.includes(req.user.id)

    // Handle dislike/undislike logic
    if (isDisliked) {
      // Undislike
      blog.dislikes = blog.dislikes.filter((dislike) => dislike.toString() !== req.user.id)
    } else {
      // Dislike
      blog.dislikes.push(req.user.id)

      // Remove from likes if present
      if (isLiked) {
        blog.likes = blog.likes.filter((like) => like.toString() !== req.user.id)
      }
    }

    await blog.save()

    ApiResponse.success(res, isDisliked ? "Blog undisliked" : "Blog disliked", {
      likes: blog.likes.length,
      dislikes: blog.dislikes.length,
      isLiked: false,
      isDisliked: !isDisliked,
    })
  } catch (error) {
    console.error(error)
    ApiResponse.error(res, "Server error", 500)
  }
}

/**
 * @desc    Export blog as Excel
 * @route   GET /api/blogs/:id/export/excel
 * @access  Private
 */
exports.exportBlogAsExcel = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name")

    if (!blog) {
      return ApiResponse.error(res, "Blog not found", 404)
    }

    const excelBuffer = await exportService.exportBlogToExcel(blog)

    // Set headers for file download
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    res.setHeader("Content-Disposition", `attachment; filename=blog-${blog._id}.xlsx`)

    // Send the file
    res.send(excelBuffer)
  } catch (error) {
    console.error(error)
    ApiResponse.error(res, "Server error", 500)
  }
}

/**
 * @desc    Export blog as Word
 * @route   GET /api/blogs/:id/export/word
 * @access  Private
 */
exports.exportBlogAsWord = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "name")

    if (!blog) {
      return ApiResponse.error(res, "Blog not found", 404)
    }

    const wordBuffer = await exportService.exportBlogToWord(blog)

    // Set headers for file download
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    res.setHeader("Content-Disposition", `attachment; filename=blog-${blog._id}.docx`)

    // Send the file
    res.send(wordBuffer)
  } catch (error) {
    console.error(error)
    ApiResponse.error(res, "Server error", 500)
  }
}
