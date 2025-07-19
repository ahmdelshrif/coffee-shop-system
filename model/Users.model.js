const mongoose =require("mongoose")
const bcrypt=require("bcryptjs")

Userschema=new mongoose.Schema({
    name:{
        type:String,
        require:[true,"اسم المسخدم مطلوب"]
    },
    email:{
        type:String,
        require:[true,"الاميل مطلوب"]
    },
    password: String,
    role:{
      type:String,
      enum:["manager","cashier","staff","admin"],
      default:"cashier"
    },
    isActive:{
        type:Boolean,
        default:true,
    },
    profileImg:String,
    createData:Date

})
Userschema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });
const User=  mongoose.model("user",Userschema)

module.exports=User