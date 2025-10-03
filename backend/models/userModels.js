import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type : String, required : true},
    rollNo:{type : Number, required : true},
    email:{type : String, required : true, unique : true},
    password:{type : String, required : true},
    role:{type : String, enum : ["student", "faculty"], default : "student"}
})

const userModel = mongoose.models.user || mongoose.model('user', userSchema); 

export default userModel;