const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const { protect } = require("../middleware/authMiddleware")
const { authorize } = require("../middleware/roleMiddleware")
const upload = require("../middleware/uploadMiddleware")

// Public routes
router.get("/profile/:id", userController.getUserProfile)

// Protected routes
router.put("/profile", protect, upload.single("avatar"), userController.updateProfile)

// Admin routes
router.get("/", protect, authorize("admin"), userController.getUsers)
router.get("/:id", protect, authorize("admin"), userController.getUser)
router.delete("/:id", protect, authorize("admin"), userController.deleteUser)

module.exports = router
