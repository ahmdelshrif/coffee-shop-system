const synchandler=require("express-async-handler")
const Users=require("../model/Users.model")
const {createToken}=require("../middelweres/createtoken")
const dotenv=require("dotenv")
dotenv.config({path:"conf.env"})
const ApiErorr=require("../utils/apiError")
const bcrypt=require("bcryptjs")


exports.login=(synchandler (async(req, res, next) =>{
   let Token;
   const user=await Users.findOne({
       email:req.body.email,    
   })
   // compare تقوم بمقارنة الباسورد 
   if(!user || !(await bcrypt.compare(req.body.password,user.password)))
       {return next(new ApiErorr("الايميل او الباسورد غير صحيح",403))}
   
    Token = createToken({ 
    userId: user._id, 
    role: user.role // ✅ نضيفها هنا
  });
   res.status(200).json({data:user, Token})
}))

exports.updateUser=(synchandler(async(req,res,next)=>{

   const user= await Users.findByIdAndUpdate(req.User._id,{
       email:req.body.email,
       password: await bcrypt.hash(req.body.password,12),
       name:req.body.name,
       createData:Date.now()

   } ,{new:true})

   if(!user)
       {
           return next(new ApiErorr("المستخدم غير موجود",403))
       }
res.status(200).json({data:user})
}))