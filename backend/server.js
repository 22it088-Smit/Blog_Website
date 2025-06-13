const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")
const helmet = require("helmet")
const morgan = require("morgan")
const path = require("path")
const cookieParser = require("cookie-parser")
const compression = require("compression")
const { errorHandler } = require("./middleware/errorMiddleware")

// Load environment variables
dotenv.config()

// Initialize express app
const app = express()

// Connect to MongoDB
require("./config/db")()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors())
app.use(helmet())
app.use(compression())

// Logging in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Routes
app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/blogs", require("./routes/blogRoutes"))
app.use("/api/comments", require("./routes/commentRoutes"))
app.use("/api/users", require("./routes/userRoutes"))

// Base route
app.get("/", (req, res) => {
  res.send("API is running...")
})

// Error handling middleware
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})
