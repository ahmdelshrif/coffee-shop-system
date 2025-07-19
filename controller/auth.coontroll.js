const synchandler=require("express-async-handler")
const Users=require("../model/Users.model")
const {createToken}=require("../middelweres/createtoken")
const dotenv=require("dotenv")
dotenv.config({path:"conf.env"})
const ApiErorr=require("../utils/apiError")
const uploadSingleImage =require("../middelweres/uploadStringimg")
const sharp=require("sharp")
const { v4: uuidv4 } = require('uuid');
const { select } = require("async")
const jwt=require("jsonwebtoken")

// رفع صوره اثناء عمل الاكونت 
exports.uploaduserImages = uploadSingleImage.uploadSingleImage('profileImg');
// عمل تعديل للصوره
exports.resizeImage = synchandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if(req.file){
    await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 95 })
    .toFile(`uploads/User/${filename}`);
  // Save image into our db 
req.body.image = filename;

  }
  next()
});
// عمل بوتيكت قبل استخدام اي شي
exports.protect=(synchandler(async(req,res,next)=>{
    //catch token
 let token      
 if(!req.headers.authorization &&!req.headers.authorization.startsWith('bearer') )//cear all samil char
    {
        return next(new ApiErorr("يجب تسجيل الدخول  ",400))

    }
        // eslint-disable-next-line prefer-const
 token=req.headers.authorization.split(" ")[1]
       
    console.log(token)
// verfiy token 
const decoded=jwt.verify(token, process.env.TokenSecret)

console.log(decoded.userId)
const user= await Users.findById(decoded.userId)

if(user===null)
{
    return next(new ApiErorr("لا يوجد مستخدمين ",400))
}
if(user.isActive==false)
    {
        return next(new ApiErorr("هذا المستخدم غير مفعل",400))
    }

req.User=user
next();
}))
// السماحيه للمستخدم لعمل شي معين
exports.allowTO=(...roles)=>
    synchandler(async(req,res,next)=>{

if(!roles.includes(req.User.role))
{
    return next(new ApiErorr("ليس له سماحيه لهذا المستخدم ",403))
}
next()
 })

// عمل كريت للمستخد بستخدام يوزر المانجر
exports.Singup=(synchandler (async(req, res, next) =>{
let Token;
const user=await  Users.create({
    name:req.body.name,
    email:req.body.email,
    password:req.body.password,
    role:req.body.role
})
Token=createToken(user._id)
res.status(200).json({data:user, Token})
}))

// عرض كل المستخدمين للمانجير
exports.Allusers=(synchandler(async(req,res,next)=>{
    const users=await Users.find({}).select("name email role _id isActive")    
    if(!users)
    {
        return next(new ApiErorr("لا يوجد اي مستخدمين",403))
    }   
    for(let i in users ){
        if(users[i].role=="admin")
            {
                users.splice(i,1)
            }
    }
     
    res.status(200).json({data:users})
}))


//  عمل دي اكتيفيت
 exports.deactivate=(synchandler(async(req,res,next)=>{
    const users=await Users.findByIdAndUpdate({_id:req.params.id},{
        isActive:false
    })
    if(users.role=="admin")
    {
        return next(new ApiErorr("لا يمكن عمل الغاء تفعيل الادمن",403))
    }
    if(!users)
    {
        return next(new ApiErorr("المستخدم غير موجود",403))
    }
    res.status(200).json({data:users})
}))

//تحديث الرول ل يوزر معين
exports.updaterole=(synchandler(async(req,res,next)=>{
    const users=await Users.findByIdAndUpdate({_id:req.params.id},
     { role:req.body.role}
    )   
    console.log(users)
    if(!users)
    {
        return next(new ApiErorr("المستخدم غير موجود",403))
    }
    res.status(200).json({data:users})
}))




 
