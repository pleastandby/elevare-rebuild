import mongoose from "mongoose";

const syllabusSchema = new mongoose.Schema({
    faculty_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        required: true
    },
    userType: {
        type: String,
        enum: ["faculty", "student"],
        required: true,
        default: "faculty"
    },
    originalName: {
        type: String,
        required: true,
    },
    storedName: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true
});

const Syllabus = mongoose.model("Syllabus", syllabusSchema);

export default Syllabus;
