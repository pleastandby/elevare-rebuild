// config/multerConfig.js
import multer from "multer";
import fs from "fs";
import path from "path";

// Base upload directory
const baseDir = "uploads";

// Ensure folders exist
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Dynamic storage location based on user type
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userType = req.params.userType; // 'students' or 'teachers'
    const uploadPath = path.join(baseDir, userType);

    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const originalName = path.basename(file.originalname, path.extname(file.originalname));
    const dateTime = new Date().toISOString().replace(/[:.]/g, '-');
    const ext = path.extname(file.originalname);
    cb(null, `${originalName}_${dateTime}${ext}`);
  },
});

export const upload = multer({ storage });
