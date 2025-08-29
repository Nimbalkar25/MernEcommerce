// Import the Multer library
const multer = require("multer");

// ✅ Set up in-memory storage (no files will be written to disk)
const storage = multer.memoryStorage();
// Files will be temporarily held in RAM as a Buffer (req.file.buffer)
// Ideal when uploading to cloud services like Cloudinary directly from memory

// ✅ Configure the Multer upload middleware
const upload = multer({
  storage, // Use memory storage defined above

  // ✅ Set file size limit (optional but recommended)
  limits: {
    fileSize: 50 * 1024 * 1024, // Max file size = 50  MB (in bytes)
  },

  // ✅ Filter to allow only image files
  fileFilter: (req, file, cb) => {
    // Check if the uploaded file's MIME type starts with 'image/'
    if (file.mimetype.startsWith("image/")) {
      cb(null, true); // Accept the file
    } else {
      // Reject the file and return an error
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// ✅ Export the configured Multer middleware
module.exports = upload;

// 🔄 Usage Example in routes:
// router.post("/register", upload.single("avatar"), registerUser);
