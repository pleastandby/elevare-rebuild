import Syllabus from '../models/syllabusModels.js';
import asyncHandler from '../middleware/async.js';
import ErrorResponse from '../utils/errorResponse.js';
import fs from 'fs';
import path from 'path';

// @desc    Upload syllabus
// @route   POST /api/syllabus/upload
// @access  Private (faculty only)
const uploadSyllabus = asyncHandler(async (req, res, next) => {
    if (!req.file) {
        return next(new ErrorResponse('No file uploaded', 400));
    }

    const { originalname, filename, path: filePath, size } = req.file;
    const facultyId = req.user._id; // Get from authenticated user

    // Check if syllabus with same name already exists for this faculty
    const existingSyllabus = await Syllabus.findOne({ 
        faculty_id: facultyId,
        originalName: originalname 
    });

    if (existingSyllabus) {
        // Delete the uploaded file
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            console.error('Error deleting file:', error);
        }
        return next(new ErrorResponse('Syllabus with this name already exists', 400));
    }

    // Create syllabus record
    const syllabus = await Syllabus.create({
        faculty_id: facultyId,
        userType: 'faculty',
        originalName: originalname,
        storedName: filename,
        path: `/uploads/faculty/${filename}`,
        size: size
    });

    res.status(201).json({
        success: true,
        message: 'Syllabus uploaded successfully',
        data: syllabus
    });
});

// @desc    Get all syllabi for a faculty
// @route   GET /api/syllabus
// @access  Private (faculty only)
const getSyllabi = asyncHandler(async (req, res, next) => {
    const facultyId = req.user._id;
    
    const syllabi = await Syllabus.find({ faculty_id: facultyId })
        .sort({ uploadDate: -1 });

    res.status(200).json({
        success: true,
        count: syllabi.length,
        data: syllabi
    });
});

// @desc    Delete syllabus
// @route   DELETE /api/syllabus/:id
// @access  Private (faculty only)
const deleteSyllabus = asyncHandler(async (req, res, next) => {
    const syllabus = await Syllabus.findById(req.params.id);

    if (!syllabus) {
        return next(new ErrorResponse('Syllabus not found', 404));
    }

    // Check if user owns this syllabus
    if (syllabus.faculty_id.toString() !== req.user._id.toString()) {
        return next(new ErrorResponse('Not authorized to delete this syllabus', 401));
    }

    // Delete file from filesystem
    try {
        const fullPath = path.join(process.cwd(), 'uploads', 'faculty', syllabus.storedName);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    } catch (error) {
        console.error('Error deleting file:', error);
    }

    // Delete from database
    await Syllabus.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        message: 'Syllabus deleted successfully'
    });
});

export {
    uploadSyllabus,
    getSyllabi,
    deleteSyllabus
};
