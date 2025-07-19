const mongoose =require("mongoose")

reportsSchmema=new mongoose.Schema({

    name:{
        type:String,
    },
    Profits:{
        type:Number,
        default:0
    },//المصروفات - الايراد اليوم 
    Revenue:{
        type:Number,
        default:0
    },//الايراد
    Expenses:{
        type:Number,
        default:0
    }//المصروفات
})
const reports=  mongoose.model("report",reportsSchmema)
module.exports=reports