import mongoose from "mongoose";
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const studentSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    rollNo: { 
        type: Number, 
        required: [true, 'Please add a roll number'],
        unique: true
    },
    department: {
        type: String,
        required: [true, 'Please add a department'],
        enum: ['Computer Science', 'Engineering', 'Business', 'Arts', 'Science', 'Medicine'],
        default: 'Computer Science'
    },
    semester: {
        type: Number,
        required: [true, 'Please add a semester'],
        min: [1, 'Semester must be at least 1'],
        max: [8, 'Semester cannot be more than 8'],
        default: 1
    },
    email: { 
        type: String, 
        required: [true, 'Please add an email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please add a valid email']
    },
    password: { 
        type: String, 
        required: [true, 'Please add a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    role: { 
        type: String, 
        enum: ['student', 'faculty', 'admin', 'manager'],
        default: 'student' 
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    },
    resetPasswordOTP: {
        type: String,
        select: false
    },
    resetPasswordOTPExpires: {
        type: Date,
        select: false
    }
}, {
    timestamps: true
});

// Hash password before saving
studentSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to match password
studentSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
studentSchema.methods.getSignedJwtToken = function() {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );
};

const Student = mongoose.models.student || mongoose.model('student', studentSchema);

export default Student;