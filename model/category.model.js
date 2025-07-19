const mongoose =require("mongoose")

Categortyschema=new mongoose.Schema({
    name:{
        type:String,
        require:[true," يجب اداخال الصنف"],
        unique:[true,"يجب عدم تكرار الاسم"]
    },
    image:String,
    description:String,
    creatAt:Date
})
const category=  mongoose.model("category",Categortyschema)
module.exports=category