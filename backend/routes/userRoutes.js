import express from 'express';
import jwt from 'jsonwebtoken';
import { loginUser, registerUser, getMe } from '../controllers/userControllers.js';
import { registerFaculty, loginFaculty } from '../controllers/facultyControllers.js';
import { protect } from '../middleware/auth.js';
import userModel from '../models/userModels.js';
import facultyModel from '../models/facultyModels.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/facultyregister', registerFaculty);
userRouter.post('/facultylogin', loginFaculty);
userRouter.get('/me', protect, getMe);
userRouter.get('/role', async (req, res) => {
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
        user = await userModel.findById(decoded.id);
        if (user) {
            return res.json({success: true, role: "student"});
        }

        return res.json({success: false, message: "User not found"});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
});

export default userRouter;