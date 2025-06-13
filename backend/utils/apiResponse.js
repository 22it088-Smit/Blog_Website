/**
 * Class to standardize API responses
 */
class ApiResponse {
    /**
     * Success response
     * @param {object} res - Express response object
     * @param {string} message - Success message
     * @param {object} data - Response data
     * @param {number} statusCode - HTTP status code
     */
    static success(res, message, data = null, statusCode = 200) {
      return res.status(statusCode).json({
        success: true,
        message,
        data,
      })
    }
  
    /**
     * Error response
     * @param {object} res - Express response object
     * @param {string} message - Error message
     * @param {number} statusCode - HTTP status code
     */
    static error(res, message, statusCode = 400) {
      return res.status(statusCode).json({
        success: false,
        message,
      })
    }
  
    /**
     * Pagination response
     * @param {object} res - Express response object
     * @param {string} message - Success message
     * @param {object} data - Response data
     * @param {number} page - Current page
     * @param {number} limit - Items per page
     * @param {number} total - Total items
     */
    static pagination(res, message, data, page, limit, total) {
      return res.status(200).json({
        success: true,
        message,
        data,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      })
    }
  }
  
  module.exports = ApiResponse
  