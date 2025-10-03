import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
    name : {type:String, required:true},
    facultyId : {type:String, required:true, unique:true},
    email : {type:String, required:true, unique:true},
    password : {type:String, required:true},
    role:{type : String, enum : ["student", "faculty"], default : "faculty"}
})

const facultyModel = mongoose.models.faculty || mongoose.model('faculty', facultySchema);

export default facultyModel;