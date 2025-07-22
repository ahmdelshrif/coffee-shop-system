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
 if (!req.headers.authorization || !req.headers.authorization.toLowerCase().startsWith('bearer')) {
    return next(new ApiErorr("يجب تسجيل الدخول", 401));
}
//عمل توكن عند الدخول 
 token=req.headers.authorization.split(" ")[1]

// لمعرفة الداتا الخاصه باليوزر 
let decoded;
try {
    decoded = jwt.verify(token, process.env.TokenSecret);
} catch (err) {
    return next(new ApiErorr("التوكن غير صالح أو انتهت صلاحيته", 401));
}

const user= await Users.findById(decoded.userId)

if (!user) return next(new ApiErorr("المستخدم غير موجود", 404));
if (!user.isActive) return next(new ApiErorr("المستخدم غير مفعل", 403));

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
 const user = await Users.create(req.body);
 
Token=createToken(user._id)
res.status(200).json({data:user, Token})
}))

// عرض كل المستخدمين للمانجير
exports.Allusers=(synchandler(async(req,res,next)=>{
    const users = await Users.find({ role: { $ne: "admin" } }).select("name email role isActive");
    if (!users.length) return next(new ApiErorr("لا يوجد مستخدمين", 404));
    res.status(200).json({ data: users });
   
}))


//  عمل دي اكتيفيت
 exports.deactivate=(synchandler(async(req,res,next)=>{
    const users=await Users.findByIdAndUpdate({_id:req.params.id},{
        isActive:false
    })
    if (!users) return next(new ApiErorr("المستخدم غير موجود", 404));
    if (users.role === "admin") return next(new ApiErorr("لا يمكن الغاء تفعيل الادمن", 403));
    users.isActive = false;
    await users.save();
    res.status(200).json({ message: "تم الغاء التفعيل بنجاح" });
}))

//تحديث الرول ل يوزر معين
exports.updaterole=(synchandler(async(req,res,next)=>{
    const user = await Users.findById(req.params.id);
    if (!user) return next(new ApiErorr("المستخدم غير موجود", 404));

    user.role = req.body.role;
    await user.save();
    res.status(200).json({ data: user });
}))




 
 