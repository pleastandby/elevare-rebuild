import AssignmentRecords from '../models/AssignmentRecords.js';
import path from 'path';
import fs from 'fs';

// Create a new assignment
export const createAssignment = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        console.log('User from auth:', req.user);
        
        const { name, description, duedate, keywords, instructions, syllabus, existingFilePath, existingFileName, count } = req.body;
        const uploadedFile = req.file;
        
        const assignmentData = {
            name,
            description,
            duedate,
            keywords: Array.isArray(keywords) ? keywords : keywords?.split(',').map(k => k.trim()) || [],
            instructions,
            syllabus,
            count: count || 5,
            facultyId: req.user.id,
        };

        // Handle file upload (either from multer or from existing file path)
        if (uploadedFile) {
            assignmentData.fileUrl = uploadedFile.path;
            assignmentData.originalFileName = uploadedFile.originalname;
        } else if (existingFilePath) {
            // Use existing uploaded file path
            assignmentData.fileUrl = existingFilePath;
            assignmentData.originalFileName = existingFileName || 'syllabus.pdf';
        }

        console.log('Assignment data to save:', assignmentData);

        const assignment = new AssignmentRecords(assignmentData);
        await assignment.save();

        res.status(201).json({
            success: true,
            data: assignment,
            message: 'Assignment created successfully'
        });
    } catch (error) {
        // Clean up uploaded file if there was an error
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error cleaning up file:', err);
            });
        }
        
        console.error('Error creating assignment:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create assignment'
        });
    }
};

// Get all assignments for the logged-in faculty
export const getFacultyAssignments = async (req, res) => {
    try {
        console.log('🔍 Fetching assignments for faculty...');
        console.log('👤 User ID:', req.user.id);
        console.log('👤 User ID type:', typeof req.user.id);
        console.log('👤 User object:', JSON.stringify(req.user, null, 2));
        
        // Check if user has the right structure
        if (!req.user.id) {
            console.error('❌ No user ID found in request');
            return res.status(400).json({
                success: false,
                message: 'User ID not found'
            });
        }
        
        console.log('🔎 Query: AssignmentRecords.find({ facultyId: req.user.id })');
        console.log('🔎 Query params:', { facultyId: req.user.id });
        
        const assignments = await AssignmentRecords.find({ facultyId: req.user.id })
            .sort({ createdAt: -1 });
            
        console.log('📊 Found assignments:', assignments.length);
        console.log('📋 Assignment data:', JSON.stringify(assignments, null, 2));
        
        res.status(200).json({
            success: true,
            count: assignments.length,
            data: assignments
        });
    } catch (error) {
        console.error('❌ Error fetching assignments:', error);
        console.error('❌ Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch assignments',
            error: error.message
        });
    }
};

// Get a single assignment by ID
export const getAssignmentById = async (req, res) => {
    try {
        const assignment = await AssignmentRecords.findOne({
            _id: req.params.id,
            facultyId: req.user.id
        });

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found'
            });
        }

        res.status(200).json({
            success: true,
            data: assignment
        });
    } catch (error) {
        console.error('Error fetching assignment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch assignment'
        });
    }
};

// Update an assignment
export const updateAssignment = async (req, res) => {
    try {
        const updates = { ...req.body };
        
        // Handle keywords if provided
        if (updates.keywords) {
            updates.keywords = Array.isArray(updates.keywords) 
                ? updates.keywords 
                : updates.keywords.split(',').map(k => k.trim());
        }

        const assignment = await AssignmentRecords.findOneAndUpdate(
            { _id: req.params.id, facultyId: req.user.id },
            updates,
            { new: true, runValidators: true }
        );

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found or you do not have permission to update it'
            });
        }

        res.status(200).json({
            success: true,
            data: assignment,
            message: 'Assignment updated successfully'
        });
    } catch (error) {
        console.error('Error updating assignment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update assignment'
        });
    }
};

// Delete an assignment
export const deleteAssignment = async (req, res) => {
    try {
        const assignment = await AssignmentRecords.findOneAndDelete({
            _id: req.params.id,
            facultyId: req.user.id
        });

        if (!assignment) {
            return res.status(404).json({
                success: false,
                message: 'Assignment not found or you do not have permission to delete it'
            });
        }

        // Delete associated file if it exists
        if (assignment.fileUrl) {
            const filePath = path.join(process.cwd(), assignment.fileUrl);
            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }

        res.status(200).json({
            success: true,
            message: 'Assignment deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting assignment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete assignment'
        });
    }
};
