const config = require("../config/config")

/**
 * Service class for authentication related operations
 */
class AuthService {
  /**
   * Get token from model, create cookie and send response
   * @param {Object} user - User object
   * @param {number} statusCode - HTTP status code
   * @param {Object} res - Express response object
   * @param {string} message - Success message
   */
  sendTokenResponse(user, statusCode, res, message) {
    // Create token
    const token = user.getSignedJwtToken()

    // Create cookie options
    const options = {
      expires: new Date(Date.now() + config.jwtCookieExpire * 24 * 60 * 60 * 1000),
      httpOnly: true,
    }

    // Use secure cookie in production
    if (process.env.NODE_ENV === "production") {
      options.secure = true
    }

    // Remove password from output
    user.password = undefined

    res.status(statusCode).cookie("token", token, options).json({
      success: true,
      message,
      token,
      data: user,
    })
  }
}

module.exports = new AuthService()
