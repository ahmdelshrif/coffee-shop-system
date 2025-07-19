const mongoose =require("mongoose")

productsschema=new mongoose.Schema({
    category: {
        type:mongoose.Schema.ObjectId,
        ref:"category",
        required:[true,`اسم الصنف مطلوب`]

    },
    name:{
        type:String,
        require:[true," اسم المنتج مطلوب"]
    },
    description:String,
    price:Number,
    image:String,
    creatAt:Date,
    sold:{
        type:Number,
        default:0
    }
})
const products=  mongoose.model("product",productsschema)
module.exports=products