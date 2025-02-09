const asyncHandler = require("express-async-handler");

const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  res.status(201).json({
    message: "File uploaded successfully",
    filePath: `/temp/${req.params.userId}/${req.file.filename}`,
  });
});

module.exports = { uploadFile };
