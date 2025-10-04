import express from 'express';
import jwt from 'jsonwebtoken';
import {loginUser, registerUser, RegisterFaculty, loginFaculty} from '../controllers/userControllers.js';
import userModel from '../models/userModels.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/facultyregister', RegisterFaculty);
userRouter.post('/facultylogin', loginFaculty);
userRouter.get('/role', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.json({success: false, message: "No token provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.json({success: false, message: "User not found"});
        }

        res.json({success: true, role: user.role});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
});

export default userRouter;