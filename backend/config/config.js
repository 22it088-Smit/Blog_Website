module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE || "30d",
    jwtCookieExpire: Number.parseInt(process.env.JWT_COOKIE_EXPIRE) || 30,
    fileUploadPath: process.env.FILE_UPLOAD_PATH || "./uploads",
    maxFileSize: Number.parseInt(process.env.MAX_FILE_SIZE) || 5000000, // 5MB
  }
  