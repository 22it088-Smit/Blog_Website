/**
 * Error response middleware for 404 not found.
 */
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`)
    res.status(404)
    next(error)
  }
  
  /**
   * Generic error response middleware for all errors.
   */
  const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  
    res.status(statusCode)
    res.json({
      success: false,
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    })
  }
  
  module.exports = { notFound, errorHandler }
  