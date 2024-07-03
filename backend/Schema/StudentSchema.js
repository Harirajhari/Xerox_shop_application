const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    student_name:{
        type:String,
        required:true
    },
    student_email:{
        type:String,
        required:true
    },
    student_password:{
        type:String,
        required:true
    },
    student_phone:{
        type:Number,
        required:true
    },
    student_year:{
        type:String,
        required:true
    },
    student_department:{
        type:String,
        required:true
    }
})

const StudentDetail = mongoose.model("Student",StudentSchema);
module.exports = StudentDetail;