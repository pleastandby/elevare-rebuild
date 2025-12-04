import Student from '../models/studentModels.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';
import { generateOTP, sendOTPEmail } from '../utils/emailService.js';

// @desc    Register student
// @route   POST /api/student/register
// @access  Public
const registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, role, rollNo, department, semester } = req.body;

    // Check if student already exists
    const studentExists = await Student.findOne({ email });
    if (studentExists) {
        return next(new ErrorResponse('Student already exists', 400));
    }

    // Create student
    const student = await Student.create({
        name,
        email,
        password,
        role: role || 'student',
        rollNo,
        department,
        semester
    });

    sendTokenResponse(student, 201, res, 'Account Created Successfully!');
});

// @desc    Login student
// @route   POST /api/student/login
// @access  Public
const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for student
    const student = await Student.findOne({ email }).select('+password');

    if (!student) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await student.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Update last login
    student.lastLogin = Date.now();
    await student.save();

    sendTokenResponse(student, 200, res, 'Login Successful');
});

// @desc    Get current logged in student (works for student/faculty)
// @route   GET /api/student/me
// @access  Private
const getMe = asyncHandler(async (req, res, next) => {
    // req.user is set by protect middleware (already without password)
    res.status(200).json({
        success: true,
        data: req.user
    });
});

// @desc    Update student details
// @route   PUT /api/student/updatedetails
// @access  Private
const updateDetails = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    };

    const student = await Student.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: student
    });
});

// @desc    Update password
// @route   PUT /api/student/updatepassword
// @access  Private
const updatePassword = asyncHandler(async (req, res, next) => {
    const student = await Student.findById(req.user.id).select('+password');

    // Check current password
    if (!(await student.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Password is incorrect', 401));
    }

    student.password = req.body.newPassword;
    await student.save();

    sendTokenResponse(student, 200, res);
});

// @desc    Log student out / clear cookie
// @route   GET /api/student/logout
// @access  Private
const logout = asyncHandler(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        data: {}
    });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (student, statusCode, res, message) => {
    // Create token
    const token = student.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };

    // Remove password from output
    student.password = undefined;

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            role: student.role,
            userId: student._id,
            message: message || undefined
        });
};

// @desc    Forgot password
// @route   POST /api/student/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    // Validate email
    if (!email) {
        return next(new ErrorResponse('Please provide an email', 400));
    }

    // Check for student
    const student = await Student.findOne({ email });

    if (!student) {
        return next(new ErrorResponse('No student found with that email', 404));
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to database
    student.resetPasswordOTP = otp;
    student.resetPasswordOTPExpires = otpExpires;
    await student.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp);
    
    if (!emailSent && !process.env.EMAIL_USER) {
        // Development mode - email not configured but OTP was logged
        res.status(200).json({
            success: true,
            message: 'OTP generated (check console for development mode)',
            devMode: true
        });
    } else {
        // Email sent successfully
        res.status(200).json({
            success: true,
            message: 'OTP sent to your email'
        });
    }
});

// @desc    Verify OTP and reset password
// @route   POST /api/student/verify-otp
// @access  Public
const verifyOTP = asyncHandler(async (req, res, next) => {
    const { email, otp, newPassword } = req.body;

    // Validate inputs
    if (!email || !otp || !newPassword) {
        return next(new ErrorResponse('Please provide email, OTP, and new password', 400));
    }

    // Find student with OTP
    const student = await Student.findOne({ 
        email,
        resetPasswordOTP: otp,
        resetPasswordOTPExpires: { $gt: Date.now() }
    }).select('+resetPasswordOTP +resetPasswordOTPExpires');

    if (!student) {
        return next(new ErrorResponse('Invalid or expired OTP', 400));
    }

    // Update password and clear OTP
    student.password = newPassword;
    student.resetPasswordOTP = undefined;
    student.resetPasswordOTPExpires = undefined;
    await student.save();

    res.status(200).json({
        success: true,
        message: 'Password reset successfully'
    });
});

export {
    registerUser,
    loginUser,
    getMe,
    updateDetails,
    updatePassword,
    logout,
    forgotPassword,
    verifyOTP
};
