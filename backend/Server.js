import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/mongodb.js';
import studentRouter from './routes/studentRoutes.js';
import syllabusRouter from './routes/syllabusRoutes.js';
import errorHandler from './middleware/error.js';
import uploadRoutes from './routes/uploadRoutes.js';
import AssignmentRecordsRouter from './routes/AssignmentRecordRouter.js';
import aiRoutes from './routes/aiRoutes.js';

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File uploads
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));
app.use("/upload", uploadRoutes);

// API Routes
app.use('/api/student', studentRouter);
app.use('/api/syllabus', syllabusRouter);
app.use('/api/assignment', AssignmentRecordsRouter);
app.use('/api/ai', aiRoutes);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
    });
}

app.get('/', (req, res) => {
    res.send("API working...");
});

// Centralized error handler (should be after routes)
app.use(errorHandler);

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});