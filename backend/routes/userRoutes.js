import express from 'express';
import {loginUser, registerUser, RegisterFaculty, loginFaculty} from '../controllers/userControllers.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/facultyregister', RegisterFaculty);
userRouter.post('/facultylogin', loginFaculty);
userRouter.get('/role', (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = userModel.findById(decoded.id);
        res.json({success: true, role: user.role});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
});

export default userRouter;