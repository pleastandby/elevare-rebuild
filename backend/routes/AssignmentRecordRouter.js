import express from "express";
import { protect } from "../middleware/auth.js";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import {
    createAssignment,
    getFacultyAssignments,
    getAssignmentById,
    updateAssignment,
    deleteAssignment
} from "../controllers/assignmentController.js";

const router = express.Router({ mergeParams: true });

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/assignments/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf|doc|docx|txt/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed'));
        }
    }
});

// Create a new assignment with optional file upload
router.post("/", protect, upload.single('file'), createAssignment);

// Get all assignments for the logged-in faculty
router.get("/", protect, getFacultyAssignments);

// Get a single assignment by ID
router.get("/:id", protect, getAssignmentById);

// Update an assignment
router.put("/:id", protect, upload.single('file'), updateAssignment);

// Delete an assignment
router.delete("/:id", protect, deleteAssignment);

export default router;
