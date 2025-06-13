const express = require("express")
const router = express.Router()
const blogController = require("../controllers/blogController")
const commentController = require("../controllers/commentController")
const { protect } = require("../middleware/authMiddleware")
const { authorize } = require("../middleware/roleMiddleware")
const upload = require("../middleware/uploadMiddleware")
const { blogValidation, commentValidation, validate } = require("../utils/validators")

// Public routes
router.get("/", blogController.getBlogs)
router.get("/:id", blogController.getBlog)

// Comment routes
router.get("/:blogId/comments", commentController.getComments)
router.post("/:blogId/comments", protect, commentValidation, validate, commentController.addComment)

// Protected routes
router.post("/", protect, upload.single("coverImage"), blogValidation, validate, blogController.createBlog)

router.put("/:id", protect, upload.single("coverImage"), blogValidation, validate, blogController.updateBlog)

router.delete("/:id", protect, blogController.deleteBlog)

// Like/Dislike routes
router.put("/:id/like", protect, blogController.likeBlog)
router.put("/:id/dislike", protect, blogController.dislikeBlog)

// Export routes
router.get("/:id/export/excel", protect, blogController.exportBlogAsExcel)
router.get("/:id/export/word", protect, blogController.exportBlogAsWord)

module.exports = router
