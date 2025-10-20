import User from '../models/userModels.js';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/async.js';

// @desc    Register user
// @route   POST /api/user/register
// @access  Public
const registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, role, rollNo } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new ErrorResponse('User already exists', 400));
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role: role || 'student',
        rollNo
    });

    sendTokenResponse(user, 201, res, 'Account Created Successfully!');
});

// @desc    Login user
// @route   POST /api/user/login
// @access  Public
const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save();

    sendTokenResponse(user, 200, res, 'Login Successful');
});

// @desc    Get current logged in user (works for student/faculty)
// @route   GET /api/user/me
// @access  Private
const getMe = asyncHandler(async (req, res, next) => {
    // req.user is set by protect middleware (already without password)
    res.status(200).json({
        success: true,
        data: req.user
    });
});

// @desc    Update user details
// @route   PUT /api/user/updatedetails
// @access  Private
const updateDetails = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Update password
// @route   PUT /api/user/updatepassword
// @access  Private
const updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new ErrorResponse('Password is incorrect', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
});

// @desc    Log user out / clear cookie
// @route   GET /api/user/logout
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
const sendTokenResponse = (user, statusCode, res, message) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };

    // Remove password from output
    user.password = undefined;

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            role: user.role,
            userId: user._id,
            message: message || undefined
        });
};

export {
    registerUser,
    loginUser,
    getMe,
    updateDetails,
    updatePassword,
    logout
};