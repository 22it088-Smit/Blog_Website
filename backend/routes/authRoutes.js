const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const { protect } = require("../middleware/authMiddleware")
const { registerValidation, loginValidation, validate } = require("../utils/validators")

// Public routes
router.post("/register", registerValidation, validate, authController.register)
router.post("/login", loginValidation, validate, authController.login)

// Protected routes
router.get("/me", protect, authController.getMe)
router.get("/logout", protect, authController.logout)

module.exports = router
