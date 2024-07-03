const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    admin_name:{
        type:String,
        required:true
    },
    admin_email:{
        type:String,
        required:true
    },
    admin_password:{
        type:String,
        required:true
    },
    admin_phone:{
        type:Number,
        required:true
    },
    admin_address:{
        type:String,
        required:true
    }
})

const AdminDetail = mongoose.model("Admin",AdminSchema);

module.exports = AdminDetail;