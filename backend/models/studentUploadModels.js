import mongoose from "mongoose";

const studentUploadSchema = new mongoose.Schema({
    assignment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AssignmentRecords',
        required: true
    },
    documentName: {
        type: String,
        required: true,
        trim: true
    },
    path: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    }
}, {
    timestamps: true
});

const StudentUpload = mongoose.model("StudentUpload", studentUploadSchema);

export default StudentUpload;
