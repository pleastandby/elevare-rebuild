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
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

export const upload = multer({ storage });
