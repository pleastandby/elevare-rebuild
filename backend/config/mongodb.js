import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        console.log("MONGODB_URI from env:", process.env.MONGODB_URI);

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected");
      } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
      }

}

export default connectDB;