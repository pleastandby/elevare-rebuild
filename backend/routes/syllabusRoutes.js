import express from 'express';
import { facultyUpload } from '../config/multerConfig.js';
import { protect } from '../middleware/auth.js';
import { uploadSyllabus, getSyllabi, deleteSyllabus } from '../controllers/syllabusControllers.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Upload syllabus
router.post('/upload', facultyUpload.single('file'), uploadSyllabus);

// Get all syllabi for current faculty
router.get('/', getSyllabi);

// Delete syllabus
router.delete('/:id', deleteSyllabus);

export default router;
