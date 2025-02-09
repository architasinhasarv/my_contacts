const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { uploadFile } = require("../controller/uploadFileController");
const validateToken = require("../middleware/validateTokenHandler");

// Middleware to validate token before handling file upload
router.use(validateToken);

/**
 * @swagger
 * tags:
 *   name: File Upload
 *   description: API for uploading files
 */

/**
 * @swagger
 * /api/upload/file/{userId}:
 *   post:
 *     summary: Upload a file
 *     description: Uploads a file for a specific user, storing it in a temp directory.
 *     tags: [File Upload]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user uploading the file
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to be uploaded
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *       400:
 *         description: Bad request, invalid file format
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       500:
 *         description: Internal server error
 */

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userId = req.params.userId;
    const uploadPath = path.join(__dirname, "../temp", userId);

    // Create folder if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now(); // Generate a unique timestamp
    const name = path.basename(file.originalname, path.extname(file.originalname)); // Get filename without extension
    const ext = path.extname(file.originalname); // Get file extension
    const filename = `${timestamp}_${name}${ext}`; // Append timestamp to filename

    cb(null, filename);
  }
});

// Initialize Multer
const upload = multer({ storage: storage });

// Define Upload Route
router.post("/file/:userId", upload.single("file"), uploadFile);

module.exports = router;
