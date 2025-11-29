import jwt from 'jsonwebtoken';
import asyncHandler from './async.js';
import ErrorResponse from '../utils/errorResponse.js';
import User from '../models/userModels.js';
import Faculty from '../models/facultyModels.js';

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
    let token;

    console.log('🔐 Auth middleware - checking request...');
    console.log('🔐 Headers:', req.headers.authorization ? 'Bearer token present' : 'No Bearer token');

    // Set token from Bearer token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        console.log('🔑 Token extracted successfully');
    } 
    // Set token from cookie (only if cookie-parser is used)
    else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
        console.log('🔑 Token from cookie extracted');
    }

    // Make sure token exists
    if (!token) {
        console.log('❌ No token found');
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ Token verified successfully');
        console.log('👤 Decoded user ID:', decoded.id);
        console.log('👤 Decoded user role:', decoded.role);

        // Check if user exists
        let user;
        if (decoded.role === 'faculty' || decoded.role === 'admin' || decoded.role === 'hod') {
            user = await Faculty.findById(decoded.id).select('-password');
            console.log('👨‍🏫 Faculty user found:', !!user);
        } else {
            user = await User.findById(decoded.id).select('-password');
            console.log('👤 Regular user found:', !!user);
        }

        if (!user) {
            console.log('❌ User not found in database');
            return next(new ErrorResponse('User not found', 404));
        }

        // Check if user is active
        if (user.isActive === false) {
            console.log('❌ User account is inactive');
            return next(new ErrorResponse('User account is inactive', 401));
        }

        console.log('✅ User authenticated successfully');
        req.user = user;
        next();
    } catch (err) {
        console.log('❌ Token verification failed:', err.message);
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
});

// Grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorResponse(
                    `User role ${req.user.role} is not authorized to access this route`,
                    403
                )
            );
        }
        next();
    };
};

// Check if user is the owner of the resource
const checkOwnership = (model) => {
    return async (req, res, next) => {
        const resource = await model.findById(req.params.id);

        if (!resource) {
            return next(
                new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
            );
        }

        // Make sure user is resource owner or admin
        if (resource.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(
                new ErrorResponse(
                    `User ${req.user.id} is not authorized to update this resource`,
                    401
                )
            );
        }

        next();
    };
};

export { protect, authorize, checkOwnership };
