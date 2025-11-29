import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
        trim: true,
        maxlength: [100, "Name cannot be more than 100 characters"]
    },
    description: {
        type: String,
        required: [true, "Please add a description"],
        trim: true
    },
    duedate: {
        type: Date,
        required: [true, "Please add a due date"]
    },
    instructions: {
        type: String,
        required: [true, "Please add instructions"],
        trim: true
    },
    syllabus: {
        type: String,
        required: [true, "Please add a syllabus"],
        trim: true
    },
    fileUrl: {
        type: String,
        default: null
    },
    originalFileName: {
        type: String,
        default: null
    },
    generatedAssignments: {
        type: Array,
        default: []
    },
    aiGenerated: {
        type: Boolean,
        default: false
    },
    facultyId: {
        type: String,
        required: [true, "Please provide a valid faculty ID"],
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add text index for search functionality
AssignmentSchema.index({
    name: 'text',
    description: 'text',
    instructions: 'text',
    syllabus: 'text',
    'keywords': 'text'
}, {
    weights: {
        name: 10,
        keywords: 5,
        description: 3,
        instructions: 2,
        syllabus: 1
    }
});

// Update the updatedAt field before saving
AssignmentSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const AssignmentRecords = mongoose.model("AssignmentRecords", AssignmentSchema);

export default AssignmentRecords;