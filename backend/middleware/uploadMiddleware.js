const multer = require("multer")
const path = require("path")
const config = require("../config/config")

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.fileUploadPath)
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
  },
})

// Check file type
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/
  const mimetype = filetypes.test(file.mimetype)
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

  if (mimetype && extname) {
    return cb(null, true)
  }

  cb(new Error("Only image files are allowed!"))
}

// Initialize upload
const upload = multer({
  storage,
  limits: { fileSize: config.maxFileSize },
  fileFilter,
})

module.exports = upload
