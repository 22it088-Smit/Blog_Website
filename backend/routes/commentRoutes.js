const express = require("express")
const router = express.Router()
const commentController = require("../controllers/commentController")
const { protect } = require("../middleware/authMiddleware")
const { authorize } = require("../middleware/roleMiddleware")

// Protected routes
router.delete("/:id", protect, commentController.deleteComment)

module.exports = router
