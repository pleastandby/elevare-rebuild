import userModel from '../models/userModels.js';
import facultyModel from '../models/facultyModels.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import validator from 'validator';


//token creation
const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET);
}


// Login Fucntion
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await userModel.findOne({email})

        if (!user) {
            return res.json({success : false, message : "User Not Found!"});
        }

        const isMatch = await bcrypt.compare(password, user.password); //compare password

        if (isMatch) {

            const token = createToken(user._id);    //token creation

            res.json({success : true, message : "Login Successful", token});

        } else {
            res.json({success : false , message : "Incorrect password!"});
        }

    }catch(error){
        console.log(error);
        res.json({success:false, message: error.message});
    }
}


// Register Fucntion start
const registerUser = async (req, res) => {
    try {
        const {name, rollNo, email, password, } = req.body;

        const exists = await userModel.findOne({email});

        if (exists) {
            return res.json({success : false, message : "User already exists!"});
        }

        if(!validator.isEmail(email)) {
            return res.json({success : false, message : "Invalid Email ! "});
        }

        if(password.length < 8) {
            return res.json({success : false, message : "Password must be atleast 8 characters long!"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name, email, rollNo, password : hashedPassword
        })

        const user = await newUser.save();

        const token = createToken(user._id);

        res.json({success: true,  message : "Account Created Successfully!" + token})

    }catch(error){
        console.log(error);
        res.json({success:false, message: error.message});
    }
}
//faculty register function
const RegisterFaculty = async (req, res) => {
    try {
        const {name, facultyId, email, password } = req.body;

        // Check if faculty already exists by email or facultyId
        const existsByEmail = await facultyModel.findOne({email});
        const existsByFacultyId = await facultyModel.findOne({facultyId});
        
        if (existsByEmail || existsByFacultyId) {
            return res.json({success: false, message: "Faculty already exists!"});
        }

        if(!validator.isEmail(email)) {
            return res.json({success : false, message : "Invalid Email ! "});
        }

        if(password.length < 8) {
            return res.json({success : false, message : "Password must be atleast 8 characters long!"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newFaculty = new facultyModel({
            name, email, facultyId, password : hashedPassword, role: "faculty"
        })

        const user = await newFaculty.save();

        const token = createToken(user._id);

        res.json({success: true,  message : "Account Created Successfully!" + token})

    }catch(error){
        console.log(error);
        res.json({success:false, message: error.message});
    }
}

//Faculty section
const loginFaculty = async (req, res) => {
    try {
        console.log("Faculty Login Request Body:", req.body);
        const {facultyId, email, password} = req.body;

        // Find faculty by either email or facultyId
        let faculty;
        if (email) {
            faculty = await facultyModel.findOne({email});
        } else if (facultyId) {
            faculty = await facultyModel.findOne({facultyId});
        } else {
            return res.json({success: false, message: "Please provide either email or faculty ID"});
        }

        if (!faculty) {
            return res.json({success : false, message : "Faculty Not Found!"});
        }

        const isMatch = await bcrypt.compare(password, faculty.password);

        if(isMatch){
            const token = createToken(faculty._id)

            res.json({success : true, message : "Faculty Login Successful", token})
        }else {
            res.json({success : false , message : "Incorrect password!"});
        }
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message});
    }
}

export {loginUser, registerUser, RegisterFaculty, loginFaculty};