import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected', () => {
        console.log("Mongo DB Connected Successfully")
    })

    await mongoose.connect(`${process.env.MONGODB_URI}/form`);

}

export default connectDB;