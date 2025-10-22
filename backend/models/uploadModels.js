import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  userType: {
    type: String,
    enum: ["students", "teachers"],
    required: true,
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
  size: Number,
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const File = mongoose.model("File", fileSchema);
export { File };
