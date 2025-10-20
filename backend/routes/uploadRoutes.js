// routes/uploadRoutes.js
import express from "express";
import path from "path";
import { upload } from "../config/multerConfig.js";

const router = express.Router();

// ✅ Upload file route
// Example: POST /upload/students or /upload/teachers
router.post("/:userType", upload.single("file"), (req, res) => {
  const userType = req.params.userType;

  if (!["students", "teachers"].includes(userType)) {
    return res.status(400).json({ error: "Invalid user type" });
  }

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.status(200).json({
    message: `${userType} file uploaded successfully!`,
    file: {
      name: req.file.filename,
      path: `/uploads/${userType}/${req.file.filename}`,
    },
  });
});

// ✅ Static route to serve uploaded files
router.get("/:userType/:filename", (req, res) => {
  const { userType, filename } = req.params;
  const filePath = path.resolve(`uploads/${userType}/${filename}`);
  res.sendFile(filePath);
});

export default router;
