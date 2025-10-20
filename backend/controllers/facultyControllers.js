import Faculty from '../models/facultyModels.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';

// @desc    Register faculty
// @route   POST /api/faculty/register
// @access  Public (or protect + admin if needed)
const registerFaculty = asyncHandler(async (req, res, next) => {
    const { name, facultyId, email, password } = req.body;

    // Check if faculty already exists
    const facultyExists = await Faculty.findOne({ 
        $or: [
            { email },
            { facultyId }
        ]
    });

    if (facultyExists) {
        return next(new ErrorResponse('Faculty already exists with this email or ID', 400));
    }

    // Create faculty
    const faculty = await Faculty.create({
        name,
        facultyId,
        email,
        password,
        role: 'faculty'
    });
    
    // Issue token
    const token = faculty.getSignedJwtToken();

    res.status(201).json({
        success: true,
        message: 'Account Created Successfully!',
        token,
        role: faculty.role,
        userId: faculty._id
    });
});

// @desc    Login faculty
// @route   POST /api/faculty/login
// @access  Public
const loginFaculty = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for faculty
    const faculty = await Faculty.findOne({ email }).select('+password');

    if (!faculty) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await faculty.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Update last login
    faculty.lastLogin = Date.now();
    await faculty.save();

    // Get token
    const token = faculty.getSignedJwtToken();

    res.status(200).json({
        success: true,
        message: 'Faculty Login Successful',
        token,
        role: faculty.role,
        userId: faculty._id
    });
});

export {
    registerFaculty,
    loginFaculty
};
