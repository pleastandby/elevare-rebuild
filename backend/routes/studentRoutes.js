import express from 'express';
import jwt from 'jsonwebtoken';
import { loginUser, registerUser, getMe, forgotPassword, verifyOTP } from '../controllers/studentControllers.js';
import { registerFaculty, loginFaculty } from '../controllers/facultyControllers.js';
import { protect } from '../middleware/auth.js';
import studentModel from '../models/studentModels.js';
import facultyModel from '../models/facultyModels.js';

const studentRouter = express.Router();

studentRouter.post('/register', registerUser);
studentRouter.post('/login', loginUser);
studentRouter.post('/forgot-password', forgotPassword);
studentRouter.post('/verify-otp', verifyOTP);
studentRouter.post('/facultyregister', registerFaculty);
studentRouter.post('/facultylogin', loginFaculty);
studentRouter.get('/me', protect, getMe);
studentRouter.get('/role', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.json({success: false, message: "No token provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check faculty first since it's more specific
        let user = await facultyModel.findById(decoded.id);
        if (user) {
            return res.json({success: true, role: "faculty"});
        }

        // If not faculty, check student
        user = await studentModel.findById(decoded.id);
        if (user) {
            return res.json({success: true, role: "student"});
        }

        return res.json({success: false, message: "User not found"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
});

export default studentRouter;