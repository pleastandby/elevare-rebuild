import express from "express";
import { protect } from "../middleware/auth.js";
import { generateAssignment } from "../controllers/aiController.js";

const router = express.Router();

// Generate assignments using AI
router.post("/assignments/:assignmentId/generate", protect, generateAssignment);

export default router;
