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
        type: Number,
        min: [1, 'الكمية يجب أن تكون 1 على الأقل'], // أقل قيمة
        default:0
    },//الايراد
    Expenses:{
        type: Number,
        min: [1, 'الكمية يجب أن تكون 1 على الأقل'], // أقل قيمة
        default:0
    },//المصروفات
  invoce:{
    type: Number,
    min: [1, 'الكمية يجب أن تكون 1 على الأقل'], // أقل قيمة
    default:0
}
})
const reports=  mongoose.model("report",reportsSchmema)
module.exports=reports
