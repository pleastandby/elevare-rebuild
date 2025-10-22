// routes/uploadRoutes.js
import express from "express";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import { upload } from "../config/multerConfig.js";
import { File } from "../models/uploadModels.js";

const router = express.Router();

//Upload file route
router.post("/:userType", upload.single("file"), async (req, res) => {
  try {
    const userType = req.params.userType;

    if (!["students", "teachers"].includes(userType)) {
      return res.status(400).json({ error: "Invalid user type" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { originalname, filename, path: filePath, size } = req.file;

    //Prevent duplicate file names for teachers
    if (userType === "teachers") {
      const existing = await File.findOne({ userType, originalName: originalname });
      if (existing) {
        // Delete the just-uploaded file
        fs.unlinkSync(req.file.path);
        return res
          .status(400)
          .json({ error: `A file named "${originalname}" already exists.` });
      }
    }

    // Save metadata in DB
    console.log('Attempting to save file metadata to MongoDB:', {
      userType,
      originalName: originalname,
      storedName: filename,
      path: `/uploads/${userType}/${filename}`,
      size,
    });

    const newFile = new File({
      userType,
      originalName: originalname,
      storedName: filename,
      path: `/uploads/${userType}/${filename}`,
      size,
    });

    console.log('File object created, attempting save...');
    await newFile.save();
    console.log('✅ File metadata successfully saved to MongoDB:', newFile);

    res.status(200).json({
      message: `${userType} file uploaded successfully!`,
      file: newFile,
    });
  } catch (err) {
    console.error('❌ Error uploading file:', err);

    // Log specific MongoDB errors
    if (err.name === 'ValidationError') {
      console.error('Validation Error:', err.message);
      return res.status(400).json({ error: `Validation Error: ${err.message}` });
    }

    if (err.name === 'MongoNetworkError' || err.name === 'MongooseError') {
      console.error('MongoDB Connection Error:', err.message);
      return res.status(500).json({ error: `Database Error: ${err.message}` });
    }

    // Delete uploaded file if DB save fails
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ error: "Error uploading file" });
  }
});

//Fetch all teacher files
router.get("/teachers/files", async (req, res) => {
  try {
    console.log('Fetching teacher files from MongoDB...');
    const files = await File.find({ userType: "teachers" }).sort({ uploadDate: -1 });
    console.log(`✅ Found ${files.length} teacher files in MongoDB:`, files);
    res.status(200).json({ files });
  } catch (err) {
    console.error('❌ Error fetching teacher files:', err);
    res.status(500).json({ error: "Failed to fetch files" });
  }
});

// MongoDB connection test endpoint
router.get("/test-db", async (req, res) => {
  try {
    console.log('Testing MongoDB connection...');
    const count = await File.countDocuments();
    console.log(`✅ MongoDB connection successful. Total files in DB: ${count}`);
    res.status(200).json({
      message: "MongoDB connection successful",
      totalFiles: count,
      collections: await mongoose.connection.db.listCollections().toArray()
    });
  } catch (err) {
    console.error('❌ MongoDB connection test failed:', err);
    res.status(500).json({ error: "MongoDB connection failed", details: err.message });
  }
});

//Delete file by ID
// Example: DELETE /upload/teachers/files/:id
router.delete("/teachers/files/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Delete from file system
    const fullPath = path.resolve(`uploads/${file.userType}/${file.storedName}`);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    // Delete from DB
    await File.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "File deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete file" });
  }
});
//Serve uploaded file directly
router.get("/:userType/:filename", (req, res) => {
  const { userType, filename } = req.params;
  const filePath = path.resolve(`uploads/${userType}/${filename}`);
  res.sendFile(filePath);
});

export default router;
