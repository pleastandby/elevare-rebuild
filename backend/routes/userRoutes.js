import express from 'express';
import {loginUser, registerUser, RegisterFaculty, loginFaculty} from '../controllers/userControllers.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/facultyregister', RegisterFaculty);
userRouter.post('/facultylogin', loginFaculty);

export default userRouter;