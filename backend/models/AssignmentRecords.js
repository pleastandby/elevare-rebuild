import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema({
    assignment_id: {
        type: mongoose.Schema.Types.ObjectId,
        default: () => new mongoose.Types.ObjectId(),
        unique: true
    },
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
    instruction: {
        type: String,
        required: [true, "Please add instructions"],
        trim: true
    },
    syllabus: {
        type: String,
        required: [true, "Please add a syllabus"],
        trim: true
    },
    count: {
        type: Number,
        default: 5
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
        type: Object,
        default: {}
    },
    aiGenerated: {
        type: Boolean,
        default: false
    },
    faculty_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Faculty',
        required: [true, "Please provide a valid faculty ID"]
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
    instruction: 'text',
    syllabus: 'text',
    'keywords': 'text'
}, {
    weights: {
        name: 10,
        keywords: 5,
        description: 3,
        instruction: 2,
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