import express from 'express'
import cors from "cors"
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoutes.js'
import errorHandler from './middleware/error.js'
import uploadRoutes from './routes/uploadRoutes.js'

const app = express()
const port = process.env.PORT || 4000

connectDB();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use("/upload", uploadRoutes);

app.use('/api/user', userRouter);

app.get('/', (req, res) =>{
    res.send("API working...")
});

// Centralized error handler (should be after routes)
app.use(errorHandler);

app.listen(port , ()=> console.log(`Server started on Port : ${port}`));